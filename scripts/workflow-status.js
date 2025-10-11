#!/usr/bin/env node

const path = require('path');
const fs = require('fs').promises;
const { glob } = require('glob');
const { loadKnowledgeLedgerIndex } = require('./utils/knowledge-ledger');

const REPO_ROOT = path.join(__dirname, '..');
const WORKFLOW_DIR = path.join(REPO_ROOT, 'ai-docs/workflow');
const INDEX_FILE = path.join(WORKFLOW_DIR, 'status-index.json');

const REQUIRED_FIELDS = ['featureId', 'featureTitle', 'phase', 'status', 'command'];

async function ensureWorkflowDir() {
  await fs.mkdir(WORKFLOW_DIR, { recursive: true });
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

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function collectFeatureLogs(warnings) {
  const features = [];
  const featureDirs = await glob(`${WORKFLOW_DIR}/*`, { onlyDirectories: true });

  for (const featureDir of featureDirs) {
    const dirName = path.basename(featureDir);
    const files = await glob(`${featureDir}/*.json`, { nodir: true });
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

      if (entry.featureId !== dirName) {
        warnings.push(`Skipped ${relativePath}: featureId '${entry.featureId}' does not match directory '${dirName}'`);
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

    features.push({
      featureId: latest.featureId,
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

  features.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return features;
}

async function syncWorkflowStatus(options = {}) {
  const { silent = false } = options;
  const warnings = [];

  await ensureWorkflowDir();
  const features = await collectFeatureLogs(warnings);
  const ledgerIndex = await loadKnowledgeLedgerIndex();
  warnings.push(...ledgerIndex.warnings);

  const index = {
    version: '1.1',
    generatedAt: new Date().toISOString(),
    features,
    knowledgeLedger: {
      version: ledgerIndex.version,
      source: path.relative(REPO_ROOT, ledgerIndex.source),
      adopted: ledgerIndex.adopted,
      superseded: ledgerIndex.superseded
    },
    warnings
  };

  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2));

  if (!silent) {
    console.log(`✅ Workflow status synced (${features.length} feature${features.length === 1 ? '' : 's'})`);
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
      return { version: '1.0', generatedAt: null, features: [], warnings: [] };
    }
    throw error;
  }
}

module.exports = {
  WORKFLOW_DIR,
  INDEX_FILE,
  syncWorkflowStatus,
  loadWorkflowStatusIndex
};
