#!/usr/bin/env node

const path = require('path');
const fs = require('fs').promises;
const { glob } = require('glob');
const { loadKnowledgeLedgerIndex } = require('./utils/knowledge-ledger');

const REPO_ROOT = path.join(__dirname, '..');
const CAPABILITIES_ROOT = path.join(REPO_ROOT, 'ai-docs', 'capabilities');
const LEGACY_WORKFLOW_ROOT = path.join(REPO_ROOT, 'ai-docs', 'workflow');
const INDEX_FILE = path.join(CAPABILITIES_ROOT, 'status-index.json');

const REQUIRED_FIELDS = ['featureId', 'featureTitle', 'phase', 'status', 'command'];

async function ensureCapabilitiesRoot() {
  await fs.mkdir(CAPABILITIES_ROOT, { recursive: true });
}

function validateEntry(entry) {
  const errors = [];

  REQUIRED_FIELDS.forEach(field => {
    if (!entry[field] || typeof entry[field] !== 'string') {
      errors.push(`missing field \`${field}\``);
    }
  });

  if (entry.documentation && !Array.isArray(entry.documentation)) {
    errors.push('`documentation` must be an array of strings');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function toIsoDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString();
}

function dedupeStrings(values = []) {
  return Array.from(new Set(values.filter(Boolean)));
}

const TIMESTAMP_PLACEHOLDER_PATTERNS = [
  /\$\(\s*date\s+-u\s+\+\s*\\"%Y-%m-%dT%H:%M:%SZ\\"\s*\)/g,
  /\$\(\s*date\s+-u\s+\+\s*"%Y-%m-%dT%H:%M:%SZ"\s*\)/g
];

async function inferTimestampFromFile(filePath) {
  const fileName = path.basename(filePath, '.json');
  const match = fileName.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/);
  if (match) {
    return match[0];
  }
  const stat = await fs.stat(filePath);
  return stat.mtime.toISOString();
}

function replaceTimestampPlaceholders(text, timestamp) {
  return TIMESTAMP_PLACEHOLDER_PATTERNS.reduce(
    (result, pattern) => result.replace(pattern, timestamp),
    text
  );
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');

  try {
    return JSON.parse(raw);
  } catch (error) {
    if (!raw.includes('$(date -u')) {
      throw error;
    }

    const timestamp = await inferTimestampFromFile(filePath);
    const sanitized = replaceTimestampPlaceholders(raw, timestamp);

    if (sanitized === raw) {
      throw error;
    }

    try {
      return JSON.parse(sanitized);
    } catch (sanitizedError) {
      sanitizedError.message += ' (after normalizing timestamp placeholders)';
      throw sanitizedError;
    }
  }
}

function buildCandidateDirectories() {
  return Promise.all([
    glob(`${CAPABILITIES_ROOT}/*/workflow`, { onlyDirectories: true }),
    glob(`${LEGACY_WORKFLOW_ROOT}/*/workflow`, { onlyDirectories: true }),
    glob(`${LEGACY_WORKFLOW_ROOT}/*`, {
      onlyDirectories: true,
      ignore: [
        `${LEGACY_WORKFLOW_ROOT}/capabilities`,
        `${LEGACY_WORKFLOW_ROOT}/features`
      ]
    })
  ]).then(([modern, legacyWorkflowSubdirs, legacyFlat]) => {
    const candidates = new Map();

    modern.forEach(dir => {
      const slug = path.basename(path.dirname(dir));
      candidates.set(dir, slug);
    });

    legacyWorkflowSubdirs.forEach(dir => {
      const slug = path.basename(path.dirname(dir));
      candidates.set(dir, slug);
    });

    legacyFlat.forEach(dir => {
      const slug = path.basename(dir);
      candidates.set(dir, slug);
      candidates.set(path.join(dir, 'workflow'), slug);
    });

    return candidates;
  });
}

async function collectCapabilityLogs(warnings) {
  const capabilityEntries = [];
  const candidates = await buildCandidateDirectories();

  for (const [workflowDir, slug] of candidates) {
    const stats = await fs.stat(workflowDir).catch(() => null);
    if (!stats || !stats.isDirectory()) {
      continue;
    }

    const files = await glob(`${workflowDir}/*.json`, { nodir: true });
    if (files.length === 0) {
      continue;
    }

    const logs = [];
    for (const filePath of files) {
      const relativePath = path.relative(REPO_ROOT, filePath);
      let entry;

      try {
        entry = await readJson(filePath);
      } catch (error) {
        warnings.push(`Failed to parse JSON: ${relativePath} (${error.message})`);
        continue;
      }

      const { valid, errors } = validateEntry(entry);
      if (!valid) {
        warnings.push(`Skipped ${relativePath}: ${errors.join(', ')}`);
        continue;
      }

      if (entry.featureId !== slug) {
        warnings.push(
          `Skipped ${relativePath}: featureId '${entry.featureId}' does not match directory '${slug}'`
        );
        continue;
      }

      const stat = await fs.stat(filePath);
      const timestamp = toIsoDate(entry.timestamp) || stat.mtime.toISOString();

      logs.push({
        ...entry,
        timestamp,
        source: relativePath
      });
    }

    if (logs.length === 0) {
      continue;
    }

    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const latest = logs[0];

    const documentation = dedupeStrings(
      logs.flatMap(log => {
        if (Array.isArray(log.documentation)) {
          return log.documentation;
        }
        if (typeof log.documentation === 'string') {
          return [log.documentation];
        }
        return [];
      })
    );

    const history = logs.slice(0, 5).map(log => ({
      phase: log.phase,
      status: log.status,
      timestamp: log.timestamp,
      command: log.command,
      nextCommand: log.nextCommand || null,
      summary: log.summary || null,
      outputPath: log.outputPath || null
    }));

    capabilityEntries.push({
      capabilityId: latest.featureId,
      title: latest.featureTitle,
      currentPhase: latest.phase,
      status: latest.status,
      lastCommand: latest.command,
      nextCommand: latest.nextCommand || null,
      updatedAt: latest.timestamp,
      summary: latest.summary || null,
      outputPath: latest.outputPath || null,
      documentation,
      notes: latest.notes || null,
      history,
      sourceFiles: logs.map(log => log.source)
    });
  }

  capabilityEntries.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return capabilityEntries;
}

async function syncWorkflowStatus(options = {}) {
  const { silent = false } = options;
  const warnings = [];

  await ensureCapabilitiesRoot();
  const capabilities = await collectCapabilityLogs(warnings);
  const ledgerIndex = await loadKnowledgeLedgerIndex();
  warnings.push(...ledgerIndex.warnings);

  const index = {
    version: '1.1',
    generatedAt: new Date().toISOString(),
    capabilities,
    knowledgeLedger: {
      version: ledgerIndex.version,
      source: path.relative(REPO_ROOT, ledgerIndex.source),
      adopted: ledgerIndex.adopted,
      superseded: ledgerIndex.superseded
    },
    warnings
  };

  await fs.writeFile(INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

  if (!silent) {
    console.log(`✅ Capability status synced (${capabilities.length} ${capabilities.length === 1 ? 'entry' : 'entries'})`);
    console.log(`   Saved to ${path.relative(REPO_ROOT, INDEX_FILE)}`);
    if (warnings.length > 0) {
      warnings.forEach(message => {
        console.warn(`⚠️  ${message}`);
      });
    }
  }

  return { index, warnings };
}

async function loadWorkflowStatusIndex() {
  try {
    const raw = await fs.readFile(INDEX_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { version: '1.0', generatedAt: null, capabilities: [], warnings: [] };
    }
    throw error;
  }
}

module.exports = {
  CAPABILITIES_ROOT,
  INDEX_FILE,
  syncWorkflowStatus,
  loadWorkflowStatusIndex
};
