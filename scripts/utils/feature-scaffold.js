#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const { existsSync } = require('fs');

const REPO_ROOT = path.join(__dirname, '..', '..');
const FEATURES_ROOT = path.join(REPO_ROOT, 'ai-docs', 'workflow', 'features');
const TEMPLATE_ROOT = path.join(FEATURES_ROOT, '_template');
const INDEX_FILE = path.join(FEATURES_ROOT, 'index.json');

function slugify(input) {
  if (!input) {
    return '';
  }
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureTemplateExists() {
  const stats = await fs.stat(TEMPLATE_ROOT).catch(() => null);
  if (!stats || !stats.isDirectory()) {
    throw new Error('Template directory is missing. Expected at ai-docs/workflow/features/_template');
  }
}

async function copyRecursive(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  // Copy template files recursively so new feature directories always start with the same baseline.
  // This mirrors the original scaffold script while keeping the logic reusable for migrations.
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyRecursive(srcPath, destPath);
    } else {
      const content = await fs.readFile(srcPath);
      await fs.writeFile(destPath, content);
    }
  }
}

async function writeManifest(featureDir, config, timestamps) {
  const manifestPath = path.join(featureDir, 'feature-manifest.json');
  const raw = await fs.readFile(manifestPath, 'utf8');
  const data = JSON.parse(raw);
  data.title = config.title;
  data.slug = config.slug;
  data.description = config.description || data.description || '';
  data.owner = config.owner || data.owner || '';
  data.status = config.status || data.status || 'draft';
  data.stage = config.stage || data.stage || 'intake';
  data.maxPlanTokens = config.maxPlanTokens ?? data.maxPlanTokens ?? 2000;
  data.tokenBudget = {
    planning: config.token || data.tokenBudget?.planning || 0,
    build: data.tokenBudget?.build || 0,
    reporting: data.tokenBudget?.reporting || 0,
  };
  data.linkedLedgerEntries = Array.isArray(data.linkedLedgerEntries) ? data.linkedLedgerEntries : [];
  data.relatedFeatures = Array.isArray(data.relatedFeatures) ? data.relatedFeatures : [];
  data.createdAt = data.createdAt || timestamps.createdAt;
  data.updatedAt = timestamps.updatedAt;
  await fs.writeFile(manifestPath, `${JSON.stringify(data, null, 2)}\n`);
}

async function writeReadme(featureDir, config) {
  const readmePath = path.join(featureDir, 'README.md');
  const template = await fs.readFile(readmePath, 'utf8');
  const updated = template
    .replace('- **Title:** ', `- **Title:** ${config.title}`)
    .replace('- **Owner:** ', `- **Owner:** ${config.owner || 'TBD'}`)
    .replace('- **Status:** draft', `- **Status:** ${config.status || 'draft'}`)
    .replace('- **Stage:** intake', `- **Stage:** ${config.stage || 'intake'}`);
  await fs.writeFile(readmePath, updated);
}

async function writeChecklist(featureDir, timestamps) {
  const checklistPath = path.join(featureDir, 'plans', 'checklist.json');
  const content = {
    items: [],
    metadata: {
      lastUpdated: timestamps.updatedAt,
      notes: 'Populate with plan slices using the scaffolding script or manually via /plan.',
    },
  };
  await fs.writeFile(checklistPath, `${JSON.stringify(content, null, 2)}\n`);
}

async function writeSessionBacklog(featureDir, config, timestamps) {
  const backlogPath = path.join(featureDir, 'sessions', 'session-backlog.json');
  const content = {
    lastUpdated: timestamps.updatedAt,
    owner: config.owner || '',
    items: [],
  };
  await fs.writeFile(backlogPath, `${JSON.stringify(content, null, 2)}\n`);
}

async function loadFeatureIndex() {
  const raw = await fs.readFile(INDEX_FILE, 'utf8').catch(async error => {
    if (error.code === 'ENOENT') {
      const payload = { features: [] };
      await fs.writeFile(INDEX_FILE, `${JSON.stringify(payload, null, 2)}\n`);
      return JSON.stringify(payload);
    }
    throw error;
  });
  return JSON.parse(raw);
}

async function writeFeatureIndex(index) {
  await fs.writeFile(INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`);
}

function createIndexEntry(config, timestamps) {
  return {
    title: config.title,
    slug: config.slug,
    status: config.status || 'draft',
    stage: config.stage || 'intake',
    owner: config.owner || '',
    maxPlanTokens: config.maxPlanTokens ?? 2000,
    tokenBudget: config.token || 0,
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
  };
}

async function updateIndex(config, timestamps, { created } = {}) {
  const index = await loadFeatureIndex();
  if (!Array.isArray(index.features)) {
    index.features = [];
  }

  const existing = index.features.find(entry => entry.slug === config.slug);
  if (existing) {
    existing.title = config.title;
    existing.status = config.status || existing.status;
    existing.stage = config.stage || existing.stage;
    existing.owner = config.owner || existing.owner;
    existing.maxPlanTokens = config.maxPlanTokens ?? existing.maxPlanTokens ?? 2000;
    existing.tokenBudget = config.token || existing.tokenBudget || 0;
    existing.updatedAt = timestamps.updatedAt;
  } else if (created) {
    index.features.push(createIndexEntry(config, timestamps));
  }

  index.features.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  await writeFeatureIndex(index);
}

async function scaffoldFeature(rawConfig, options = {}) {
  const config = { ...rawConfig };
  config.slug = config.slug ? slugify(config.slug) : slugify(config.title);
  if (!config.title) {
    throw new Error('Feature title is required');
  }
  if (!config.slug) {
    throw new Error('Feature slug is required');
  }

  const allowExisting = Boolean(options.allowExisting);
  await ensureTemplateExists();

  const featureDir = path.join(FEATURES_ROOT, config.slug);
  const exists = existsSync(featureDir);
  if (exists && !allowExisting) {
    throw new Error(`Feature directory already exists: ${featureDir}`);
  }

  const now = new Date().toISOString();
  const timestamps = {
    createdAt: exists ? (await fs.stat(featureDir)).birthtime?.toISOString?.() || now : now,
    updatedAt: now,
  };

  if (!exists) {
    await copyRecursive(TEMPLATE_ROOT, featureDir);
    await writeManifest(featureDir, config, timestamps);
    await writeReadme(featureDir, config);
    await writeChecklist(featureDir, timestamps);
    await writeSessionBacklog(featureDir, config, timestamps);
    await updateIndex(config, timestamps, { created: true });
    return { featureDir, created: true };
  }

  if (options.refreshMetadata) {
    await writeManifest(featureDir, config, timestamps);
    await writeReadme(featureDir, config);
  }

  await updateIndex(config, timestamps, { created: false });
  return { featureDir, created: false };
}

module.exports = {
  REPO_ROOT,
  FEATURES_ROOT,
  TEMPLATE_ROOT,
  INDEX_FILE,
  slugify,
  scaffoldFeature,
};
