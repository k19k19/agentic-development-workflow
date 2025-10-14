#!/usr/bin/env node

/**
 * Progressive feature scaffolding helper.
 *
 * Usage examples:
 *   npm run baw:feature:structure -- --feature auth-rework --list
 *   npm run baw:feature:structure -- --feature auth-rework --ensure reports/discovery --ensure plans/breakouts
 */

const fs = require('fs/promises');
const path = require('path');
const {
  REPO_ROOT,
  FEATURES_ROOT,
  OPTIONAL_SECTIONS,
  ensureTemplateExists,
  ensureOptionalSection,
  copyFromTemplate
} = require('./utils/feature-template');

function printUsage(message) {
  if (message) {
    console.error(`Error: ${message}`);
  }
  console.log('Usage: npm run baw:feature:structure -- --feature <slug|path> [options]');
  console.log('\nOptions:');
  console.log('  --list                       Show optional sections and whether they exist');
  console.log('  --ensure <section>           Copy a section from the template (repeatable)');
  console.log('  --help                       Display this message');
  process.exit(message ? 1 : 0);
}

function normalizeSection(input = '') {
  return input.replace(/^\/+/, '').replace(/\/+$/, '');
}

async function resolveFeatureDir(input) {
  if (!input) {
    throw new Error('Feature slug or path is required.');
  }

  const candidates = [];
  if (path.isAbsolute(input)) {
    candidates.push(input);
  } else {
    candidates.push(path.join(FEATURES_ROOT, input));
    candidates.push(path.join(REPO_ROOT, input));
  }

  for (const candidate of candidates) {
    const stats = await fs.stat(candidate).catch(() => null);
    if (stats && stats.isDirectory()) {
      return candidate;
    }
  }

  throw new Error(`Could not locate feature directory for "${input}".`);
}

async function listSections(featureDir) {
  console.log(`Feature: ${path.relative(REPO_ROOT, featureDir)}\n`);
  console.log('Optional sections:\n');
  const entries = Object.entries(OPTIONAL_SECTIONS);
  for (const [key, meta] of entries) {
    const sectionPath = path.join(featureDir, meta.source);
    const exists = await fs.stat(sectionPath).catch(() => null);
    const marker = exists ? '✔' : '·';
    console.log(` ${marker} ${key}`);
    console.log(`    ${meta.description}`);
  }
}

async function ensureSections(featureDir, sections) {
  if (sections.length === 0) {
    throw new Error('At least one --ensure <section> value is required.');
  }

  const created = [];
  for (const raw of sections) {
    const section = normalizeSection(raw);
    if (!section) {
      continue;
    }
    try {
      if (OPTIONAL_SECTIONS[section]) {
        await ensureOptionalSection(featureDir, section);
      } else {
        await copyFromTemplate(section, featureDir);
      }
      created.push(section);
    } catch (error) {
      throw new Error(`Failed to copy "${section}": ${error.message}`);
    }
  }

  if (created.length > 0) {
    console.log('Added sections:');
    created.forEach(entry => console.log(`  - ${entry}`));
  } else {
    console.log('No new sections were added.');
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    feature: '',
    list: false,
    ensure: []
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      printUsage();
    } else if (arg === '--feature') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) {
        printUsage('Missing value for --feature');
      }
      config.feature = value;
      index += 1;
    } else if (arg === '--list') {
      config.list = true;
    } else if (arg === '--ensure') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) {
        printUsage('Missing value for --ensure');
      }
      config.ensure.push(value);
      index += 1;
    } else {
      printUsage(`Unexpected option: ${arg}`);
    }
  }

  if (!config.feature) {
    printUsage('The --feature option is required.');
  }

  return config;
}

async function main() {
  try {
    const config = parseArgs();
    await ensureTemplateExists();
    const featureDir = await resolveFeatureDir(config.feature);

    if (config.list) {
      await listSections(featureDir);
    }

    if (config.ensure.length > 0) {
      await ensureSections(featureDir, config.ensure);
    }

    if (!config.list && config.ensure.length === 0) {
      console.log('Nothing to do. Use --list or --ensure to modify the workspace.');
    }
  } catch (error) {
    console.error(`Failed to adjust feature structure: ${error.message}`);
    process.exit(1);
  }
}

main();
