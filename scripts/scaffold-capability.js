#!/usr/bin/env node

/**
 * Scaffold a structured capability workspace under ai-docs/capabilities.
 *
 * Usage:
 *   npm run baw:capability:scaffold -- --title "Fleet Dispatch" --owner ops --maxPlanTokens 4000
 *
 * Optional flags:
 *   --slug <slug>             Override the generated slug
 *   --description <text>      Short description for the manifest
 *   --status <status>         Lifecycle status (default: draft)
 *   --stage <stage>           Workflow stage (default: intake)
 *   --token <number>          Estimated total token budget for the capability
 */

const fs = require('fs/promises');
const path = require('path');
const { existsSync } = require('fs');
const {
  REPO_ROOT,
  CAPABILITIES_ROOT,
  MINIMAL_FILES,
  OPTIONAL_SECTIONS,
  ensureTemplateExists,
  copyFromTemplate,
  ensureOptionalSection,
  copyTemplateTree
} = require('./utils/capability-template');

const INDEX_FILE = path.join(CAPABILITIES_ROOT, 'index.json');
const VALID_PROFILES = new Set(['minimal', 'full']);

function printUsage(message) {
  if (message) {
    console.error(`Error: ${message}`);
  }
  console.log('Usage: npm run baw:capability:scaffold -- --title "Capability Title" [options]');
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

async function applyIncludes(capabilityDir, includes = []) {
  const seen = new Set();
  for (const raw of includes) {
    const normalized = normalizeInclude(raw);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    try {
      if (OPTIONAL_SECTIONS[normalized]) {
        await ensureOptionalSection(capabilityDir, normalized);
      } else {
        await copyFromTemplate(normalized, capabilityDir);
      }
    } catch (error) {
      throw new Error(`Failed to include "${normalized}": ${error.message}`);
    }
  }
}

async function copyMinimalProfile(capabilityDir, includes) {
  await fs.mkdir(capabilityDir, { recursive: true });
  for (const relativePath of MINIMAL_FILES) {
    await copyFromTemplate(relativePath, capabilityDir);
  }
  await applyIncludes(capabilityDir, includes);
}

async function writeManifest(capabilityDir, config, timestamps) {
  const manifestPath = path.join(capabilityDir, 'capability-manifest.json');
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
  data.relatedCapabilities = Array.isArray(data.relatedCapabilities) ? data.relatedCapabilities : [];
  data.createdAt = timestamps.createdAt;
  data.updatedAt = timestamps.updatedAt;
  await fs.writeFile(manifestPath, `${JSON.stringify(data, null, 2)}\n`);
}

async function writeReadme(capabilityDir, config) {
  const readmePath = path.join(capabilityDir, 'README.md');
  const template = await fs.readFile(readmePath, 'utf8');
  const updated = template
    .replace('- **Title:** ', `- **Title:** ${config.title}`)
    .replace('- **Owner:** ', `- **Owner:** ${config.owner || 'TBD'}`)
    .replace('- **Status:** draft', `- **Status:** ${config.status}`)
    .replace('- **Stage:** intake', `- **Stage:** ${config.stage}`);
  await fs.writeFile(readmePath, updated);
}

async function writeChecklist(capabilityDir, timestamps) {
  const checklistPath = path.join(capabilityDir, 'plans', 'checklist.json');
  const content = {
    items: [],
    metadata: {
      lastUpdated: timestamps.updatedAt,
      notes: 'Populate with plan slices using the scaffolding script or manually via /baw_dev_plan.',
    },
  };
  await fs.writeFile(checklistPath, `${JSON.stringify(content, null, 2)}\n`);
}

async function writeSessionBacklog(capabilityDir, config, timestamps) {
  const backlogPath = path.join(capabilityDir, 'sessions', 'session-backlog.json');
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
      const payload = { capabilities: [] };
      await fs.writeFile(INDEX_FILE, `${JSON.stringify(payload, null, 2)}\n`);
      return JSON.stringify(payload);
    }
    throw error;
  });

  const index = JSON.parse(indexRaw);
  if (!Array.isArray(index.capabilities)) {
    index.capabilities = [];
  }

  const existing = index.capabilities.find((entry) => entry.slug === config.slug);
  if (existing) {
    throw new Error(`Capability with slug ${config.slug} already exists in index.json`);
  }

  index.capabilities.push({
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

  index.capabilities.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  await fs.writeFile(INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`);
}

async function main() {
  try {
    const config = parseArgs();
    config.slug = config.slug ? slugify(config.slug) : slugify(config.title);

    await ensureTemplateExists();

    const capabilityDir = path.join(CAPABILITIES_ROOT, config.slug);
    if (existsSync(capabilityDir)) {
      throw new Error(`Capability directory already exists: ${capabilityDir}`);
    }

    const timestamps = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (config.profile === 'full') {
      await copyTemplateTree(capabilityDir);
    } else {
      await copyMinimalProfile(capabilityDir, config.includes);
    }

    await writeManifest(capabilityDir, config, timestamps);
    await writeReadme(capabilityDir, config);
    await writeChecklist(capabilityDir, timestamps);
    await writeSessionBacklog(capabilityDir, config, timestamps);
    await updateIndex(config, timestamps);

    console.log(`✔ Created capability workspace at ${path.relative(REPO_ROOT, capabilityDir)}`);
    console.log(`   Profile: ${config.profile}${config.includes.length ? ` (plus ${config.includes.length} additional section${config.includes.length === 1 ? '' : 's'})` : ''}`);
    console.log('Next steps:');
    console.log('  1. Fill in intake/requirements.md with the problem statement.');
    console.log('  2. Draft the first plan slice in plans/checklist.json and run /baw_dev_plan.');
    console.log('  3. Record the decision in the knowledge ledger if this is a new initiative.');
    console.log(
      '  4. Use npm run baw:capability:structure -- --capability <slug> --ensure <section> to pull in extra directories when the task grows.'
    );
  } catch (error) {
    console.error(`Failed to scaffold capability: ${error.message}`);
    process.exit(1);
  }
}

main();
