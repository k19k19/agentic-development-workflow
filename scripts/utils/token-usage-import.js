#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');
const { normalizeTokens } = require('./token-budget-calculator');
const { TOKEN_USAGE_FILE } = require('./token-usage-analyzer');

const DEFAULT_INCLUDE = '**/*.{md,txt,log}';
const DEFAULT_SOURCE = 'auto';

function parseArguments(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) {
      continue;
    }

    const key = arg.slice(2);
    let value = true;
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      value = next;
      index += 1;
    }

    if (result[key] === undefined) {
      result[key] = value;
    } else if (Array.isArray(result[key])) {
      result[key].push(value);
    } else {
      result[key] = [result[key], value];
    }
  }
  return result;
}

function stripDelimiters(value) {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value !== 'string') {
    return 0;
  }
  return value.replace(/[,\s]/g, '');
}

function parseTokenValue(value) {
  return normalizeTokens(stripDelimiters(value));
}

function detectModel(label) {
  const normalized = label.toLowerCase();
  if (/total/.test(normalized)) {
    return 'total';
  }
  if (/claude|sonnet|opus|haiku/.test(normalized)) {
    return 'claude';
  }
  if (/gemini|palm/.test(normalized)) {
    return 'gemini';
  }
  if (/codex/.test(normalized)) {
    return 'codex';
  }
  if (/openai|gpt|o1|o3|o4/.test(normalized)) {
    return 'openai';
  }
  if (/mistral|llama|mixtral|anthropic|perplexity|deepmind|llm/.test(normalized)) {
    return 'other';
  }
  return null;
}

function parseTokenUsage(text) {
  if (!text) {
    return null;
  }

  const byModel = {};
  let total = 0;
  const lineRegex = /^\s*(?:[-*]\s*)?([A-Za-z0-9 ()\/_.:+-]+?)(?:\s+(?:token(?:s)?(?: usage| used)?|usage))?\s*[:=-]\s*([0-9][0-9,\s]*)/gim;

  let match = lineRegex.exec(text);
  while (match) {
    const label = match[1].trim();
    const tokens = parseTokenValue(match[2]);
    if (tokens > 0) {
      const model = detectModel(label);
      if (model === 'total') {
        total = Math.max(total, tokens);
      } else if (model) {
        byModel[model] = (byModel[model] || 0) + tokens;
      }
    }
    match = lineRegex.exec(text);
  }

  if (Object.keys(byModel).length === 0 && total === 0) {
    return null;
  }

  if (total === 0) {
    total = Object.values(byModel).reduce((sum, value) => sum + value, 0);
  }

  if (total === 0) {
    return null;
  }

  return { total, byModel };
}

async function readFileSafe(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

async function loadExistingEntries(logPath = TOKEN_USAGE_FILE) {
  const raw = await readFileSafe(logPath);
  if (!raw) {
    return { entries: [], sourceFiles: new Set() };
  }

  const lines = raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const entries = [];
  const sourceFiles = new Set();

  lines.forEach(line => {
    try {
      const entry = JSON.parse(line);
      entries.push(entry);
      if (entry.sourceFile) {
        sourceFiles.add(entry.sourceFile);
      }
    } catch (error) {
      // ignore malformed lines
    }
  });

  return { entries, sourceFiles };
}

function detectSessionId(filePath) {
  const match = filePath.match(/SESSION-[A-Za-z0-9-_.]+/i);
  return match ? match[0] : undefined;
}

function buildLogEntry({
  usage,
  filePath,
  stats,
  note,
  sessionId,
  source = DEFAULT_SOURCE
}) {
  const byModel = {};
  Object.entries(usage.byModel).forEach(([model, value]) => {
    if (value > 0) {
      byModel[model] = { total: normalizeTokens(value) };
    }
  });

  const entry = {
    timestamp: new Date(stats.mtime).toISOString(),
    source,
    sourceFile: filePath,
    tokens: {
      total: normalizeTokens(usage.total),
      byModel
    }
  };

  if (note) {
    entry.note = note;
  }

  if (sessionId) {
    entry.sessionId = sessionId;
  }

  return entry;
}

async function appendEntries(entries, logPath = TOKEN_USAGE_FILE, dryRun = false) {
  if (!entries.length) {
    return;
  }

  const directory = path.dirname(logPath);
  if (!dryRun) {
    await fs.mkdir(directory, { recursive: true });
  }

  const lines = entries.map(entry => `${JSON.stringify(entry)}\n`).join('');
  if (!dryRun) {
    await fs.appendFile(logPath, lines, { encoding: 'utf8' });
  }
}

async function discoverFiles(target, includePattern = DEFAULT_INCLUDE) {
  const stats = await fs.stat(target);
  if (stats.isFile()) {
    return [{ path: target, stats }];
  }
  if (!stats.isDirectory()) {
    return [];
  }

  const matches = await glob(includePattern, {
    cwd: target,
    nodir: true,
    absolute: true
  });

  const results = [];
  await Promise.all(
    matches.map(async filePath => {
      try {
        const fileStats = await fs.stat(filePath);
        if (fileStats.isFile()) {
          results.push({ path: filePath, stats: fileStats });
        }
      } catch (error) {
        // ignore files that disappear between glob and stat
      }
    })
  );
  return results;
}

async function resolveTargetRoots(targetPath) {
  if (targetPath) {
    return [path.resolve(targetPath)];
  }

  const cwd = process.cwd();
  const capabilitiesDir = path.resolve(cwd, 'ai-docs/capabilities');
  const legacyFeaturesDir = path.resolve(cwd, 'ai-docs/workflow/features');
  const candidates = [capabilitiesDir, legacyFeaturesDir];
  const existing = [];
  for (const candidate of candidates) {
    try {
      const stats = await fs.stat(candidate);
      if (stats.isDirectory()) {
        existing.push(candidate);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  return existing.length ? existing : [capabilitiesDir];
}

async function collectFiles(targetRoots, includePattern) {
  const allFiles = [];
  for (const root of targetRoots) {
    try {
      const discovered = await discoverFiles(root, includePattern);
      allFiles.push(...discovered);
    } catch (error) {
      if (error.code === 'ENOENT') {
        continue;
      }
      throw error;
    }
  }
  return allFiles;
}

async function extractUsageFromFile(filePath) {
  const content = await readFileSafe(filePath);
  if (!content) {
    return null;
  }
  return parseTokenUsage(content);
}

function shouldSkipFile({ stats, since }) {
  if (!since) {
    return false;
  }
  const sinceDate = since instanceof Date ? since : new Date(since);
  if (Number.isNaN(sinceDate.getTime())) {
    return false;
  }
  return stats.mtime < sinceDate;
}

async function runImport({
  targetPath,
  include = DEFAULT_INCLUDE,
  note,
  sessionId,
  source = DEFAULT_SOURCE,
  dryRun = false,
  logPath = TOKEN_USAGE_FILE,
  since
}) {
  const { sourceFiles } = await loadExistingEntries(logPath);
  const targetRoots = await resolveTargetRoots(targetPath);
  const files = await collectFiles(targetRoots, include);
  if (files.length === 0) {
    return { entries: [], processed: [], skipped: [] };
  }

  const processed = [];
  const skipped = [];
  const newEntries = [];

  for (const file of files) {
    const relativePath = path.relative(process.cwd(), file.path);
    if (sourceFiles.has(relativePath)) {
      skipped.push({ file: relativePath, reason: 'already-logged' });
      continue;
    }

    if (shouldSkipFile({ stats: file.stats, since })) {
      skipped.push({ file: relativePath, reason: 'before-since' });
      continue;
    }

    const usage = await extractUsageFromFile(file.path);
    if (!usage) {
      skipped.push({ file: relativePath, reason: 'no-usage-found' });
      continue;
    }

    const derivedSession = sessionId || detectSessionId(relativePath);
    const entry = buildLogEntry({
      usage,
      filePath: relativePath,
      stats: file.stats,
      note,
      sessionId: derivedSession,
      source
    });
    newEntries.push(entry);
    processed.push({ file: relativePath, usage });
  }

  await appendEntries(newEntries, logPath, dryRun);

  return { entries: newEntries, processed, skipped };
}

async function main() {
  try {
    const args = parseArguments(process.argv.slice(2));
    const targetPath = typeof args.path === 'string' ? args.path : undefined;
    const include = typeof args.include === 'string' ? args.include : DEFAULT_INCLUDE;
    const note = typeof args.note === 'string' ? args.note : undefined;
    const sessionId = typeof args.session === 'string' ? args.session : undefined;
    const source = typeof args.source === 'string' ? args.source : DEFAULT_SOURCE;
    const dryRun = args['dry-run'] !== undefined || args.dry === true;
    const since = typeof args.since === 'string' ? args.since : undefined;
    const logPath = typeof args.log === 'string' ? path.resolve(args.log) : TOKEN_USAGE_FILE;

    const { entries, processed, skipped } = await runImport({
      targetPath,
      include,
      note,
      sessionId,
      source,
      dryRun,
      logPath,
      since
    });

    if (!processed.length) {
      console.log('No token usage entries discovered.');
    } else {
      if (dryRun) {
        console.log(`Dry run: would log ${processed.length} entr${processed.length === 1 ? 'y' : 'ies'}.`);
      } else {
        console.log(`Logged ${processed.length} token usage entr${processed.length === 1 ? 'y' : 'ies'}.`);
      }
      processed.forEach(item => {
        const models = Object.entries(item.usage.byModel)
          .map(([model, value]) => `${model}:${value.toLocaleString('en-US')}`)
          .join(', ');
        console.log(` - ${item.file} → total ${item.usage.total.toLocaleString('en-US')} (${models || 'total only'})`);
      });
    }

    if (skipped.length) {
      console.log(`Skipped ${skipped.length} file${skipped.length === 1 ? '' : 's'}:`);
      skipped.forEach(item => {
        console.log(` - ${item.file} (${item.reason})`);
      });
    }
  } catch (error) {
    console.error(`❌ Failed to import token usage: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArguments,
  parseTokenUsage,
  detectModel,
  detectSessionId,
  buildLogEntry,
  extractUsageFromFile,
  runImport,
  DEFAULT_INCLUDE,
  DEFAULT_SOURCE
};
