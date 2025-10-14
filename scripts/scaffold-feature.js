#!/usr/bin/env node

/**
 * Scaffold a structured feature workspace under ai-docs/workflow/features.
 *
 * Usage:
 *   npm run baw:feature:scaffold -- --title "Fleet Dispatch" --owner ops --maxPlanTokens 4000
 *
 * Optional flags:
 *   --slug <slug>             Override the generated slug
 *   --description <text>      Short description for the manifest
 *   --status <status>         Lifecycle status (default: draft)
 *   --stage <stage>           Workflow stage (default: intake)
 *   --token <number>          Estimated total token budget for the feature
 */

const fs = require('fs/promises');
const path = require('path');
const { existsSync } = require('fs');
const {
  REPO_ROOT,
  FEATURES_ROOT,
  MINIMAL_FILES,
  OPTIONAL_SECTIONS,
  ensureTemplateExists,
  copyFromTemplate,
  ensureOptionalSection,
  copyTemplateTree
} = require('./utils/feature-template');

const INDEX_FILE = path.join(FEATURES_ROOT, 'index.json');
const VALID_PROFILES = new Set(['minimal', 'full']);

function printUsage(message) {
  if (message) {
    console.error(`Error: ${message}`);
  }
  console.log('Usage: npm run baw:feature:scaffold -- --title "Feature Title" [options]');
  console.log('Options:');
  console.log('  --slug <slug>');
  console.log('  --owner <owner>');
  console.log('  --description <text>');
  console.log('  --status <status> (default: draft)');
  console.log('  --stage <stage> (default: intake)');
  console.log('  --maxPlanTokens <number> (default: 2000)');
  console.log('  --token <number> (estimated total token budget)');
  console.log('  --profile <minimal|full>  (default: minimal)');
  console.log('  --include <path>          Additional sections to copy from the template (repeatable)');
  process.exit(1);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    title: '',
    slug: '',
    owner: '',
    description: '',
    status: 'draft',
    stage: 'intake',
    maxPlanTokens: 2000,
    token: 0,
    profile: 'minimal',
    includes: []
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith('--')) {
      printUsage(`Unexpected argument: ${arg}`);
    }
    const key = arg.slice(2);
    if (['title', 'slug', 'owner', 'description', 'status', 'stage'].includes(key)) {
      const value = args[i + 1];
      if (!value || value.startsWith('--')) {
        printUsage(`Missing value for --${key}`);
      }
      config[key] = value;
      i += 1;
    } else if (key === 'maxPlanTokens' || key === 'token') {
      const value = args[i + 1];
      if (!value || value.startsWith('--')) {
        printUsage(`Missing value for --${key}`);
      }
      const parsed = Number(value);
      if (Number.isNaN(parsed) || parsed < 0) {
        printUsage(`Invalid number for --${key}`);
      }
      if (key === 'maxPlanTokens') {
        config.maxPlanTokens = parsed;
      } else {
        config.token = parsed;
      }
      i += 1;
    } else if (key === 'profile') {
      const value = args[i + 1];
      if (!value || value.startsWith('--')) {
        printUsage('Missing value for --profile');
      }
      if (!VALID_PROFILES.has(value)) {
        printUsage(`Invalid profile "${value}". Expected one of: ${Array.from(VALID_PROFILES).join(', ')}`);
      }
      config.profile = value;
      i += 1;
    } else if (key === 'include') {
      const value = args[i + 1];
      if (!value || value.startsWith('--')) {
        printUsage('Missing value for --include');
      }
      config.includes.push(value);
      i += 1;
    } else {
      printUsage(`Unknown option: --${key}`);
    }
  }

  if (!config.title) {
    printUsage('The --title option is required.');
  }

  return config;
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normalizeInclude(value = '') {
  return value.replace(/^\/+/, '').replace(/\/+$/, '');
}

async function applyIncludes(featureDir, includes = []) {
  const seen = new Set();
  for (const raw of includes) {
    const normalized = normalizeInclude(raw);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    try {
      if (OPTIONAL_SECTIONS[normalized]) {
        await ensureOptionalSection(featureDir, normalized);
      } else {
        await copyFromTemplate(normalized, featureDir);
      }
    } catch (error) {
      throw new Error(`Failed to include "${normalized}": ${error.message}`);
    }
  }
}

async function copyMinimalProfile(featureDir, includes) {
  await fs.mkdir(featureDir, { recursive: true });
  for (const relativePath of MINIMAL_FILES) {
    await copyFromTemplate(relativePath, featureDir);
  }
  await applyIncludes(featureDir, includes);
}

async function writeManifest(featureDir, config, timestamps) {
  const manifestPath = path.join(featureDir, 'feature-manifest.json');
  const raw = await fs.readFile(manifestPath, 'utf8');
  const data = JSON.parse(raw);
  data.title = config.title;
  data.slug = config.slug;
  data.description = config.description;
  data.owner = config.owner;
  data.status = config.status;
  data.stage = config.stage;
  data.maxPlanTokens = config.maxPlanTokens;
  data.tokenBudget = {
    planning: config.token || 0,
    build: 0,
    reporting: 0,
  };
  data.linkedLedgerEntries = Array.isArray(data.linkedLedgerEntries)
    ? data.linkedLedgerEntries
    : [];
  data.relatedFeatures = Array.isArray(data.relatedFeatures) ? data.relatedFeatures : [];
  data.createdAt = timestamps.createdAt;
  data.updatedAt = timestamps.updatedAt;
  await fs.writeFile(manifestPath, `${JSON.stringify(data, null, 2)}\n`);
}

async function writeReadme(featureDir, config) {
  const readmePath = path.join(featureDir, 'README.md');
  const template = await fs.readFile(readmePath, 'utf8');
  const updated = template
    .replace('- **Title:** ', `- **Title:** ${config.title}`)
    .replace('- **Owner:** ', `- **Owner:** ${config.owner || 'TBD'}`)
    .replace('- **Status:** draft', `- **Status:** ${config.status}`)
    .replace('- **Stage:** intake', `- **Stage:** ${config.stage}`);
  await fs.writeFile(readmePath, updated);
}

async function writeChecklist(featureDir, timestamps) {
  const checklistPath = path.join(featureDir, 'plans', 'checklist.json');
  const content = {
    items: [],
    metadata: {
      lastUpdated: timestamps.updatedAt,
      notes: 'Populate with plan slices using the scaffolding script or manually via /baw_dev_plan.',
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

async function updateIndex(config, timestamps) {
  const indexRaw = await fs.readFile(INDEX_FILE, 'utf8').catch(async (error) => {
    if (error.code === 'ENOENT') {
      const payload = { features: [] };
      await fs.writeFile(INDEX_FILE, `${JSON.stringify(payload, null, 2)}\n`);
      return JSON.stringify(payload);
    }
    throw error;
  });

  const index = JSON.parse(indexRaw);
  if (!Array.isArray(index.features)) {
    index.features = [];
  }

  const existing = index.features.find((entry) => entry.slug === config.slug);
  if (existing) {
    throw new Error(`Feature with slug ${config.slug} already exists in index.json`);
  }

  index.features.push({
    title: config.title,
    slug: config.slug,
    status: config.status,
    stage: config.stage,
    owner: config.owner || '',
    maxPlanTokens: config.maxPlanTokens,
    tokenBudget: config.token || 0,
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
  });

  index.features.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  await fs.writeFile(INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`);
}

async function main() {
  try {
    const config = parseArgs();
    config.slug = config.slug ? slugify(config.slug) : slugify(config.title);

    await ensureTemplateExists();

    const featureDir = path.join(FEATURES_ROOT, config.slug);
    if (existsSync(featureDir)) {
      throw new Error(`Feature directory already exists: ${featureDir}`);
    }

    const timestamps = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (config.profile === 'full') {
      await copyTemplateTree(featureDir);
    } else {
      await copyMinimalProfile(featureDir, config.includes);
    }

    await writeManifest(featureDir, config, timestamps);
    await writeReadme(featureDir, config);
    await writeChecklist(featureDir, timestamps);
    await writeSessionBacklog(featureDir, config, timestamps);
    await updateIndex(config, timestamps);

    console.log(`✔ Created feature workspace at ${path.relative(REPO_ROOT, featureDir)}`);
    console.log(`   Profile: ${config.profile}${config.includes.length ? ` (plus ${config.includes.length} additional section${config.includes.length === 1 ? '' : 's'})` : ''}`);
    console.log('Next steps:');
    console.log('  1. Fill in intake/requirements.md with the problem statement.');
    console.log('  2. Draft the first plan slice in plans/checklist.json and run /baw_dev_plan.');
    console.log('  3. Record the decision in the knowledge ledger if this is a new initiative.');
    console.log(
      '  4. Use npm run baw:feature:structure -- --feature <slug> --ensure <section> to pull in extra directories when the task grows.'
    );
  } catch (error) {
    console.error(`Failed to scaffold feature: ${error.message}`);
    process.exit(1);
  }
}

main();
