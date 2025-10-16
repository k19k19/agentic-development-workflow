#!/usr/bin/env node

/**
 * Progressive capability scaffolding helper.
 *
 * Usage examples:
 *   npm run baw:capability:structure -- --capability auth-rework --list
 *   npm run baw:capability:structure -- --capability auth-rework --ensure reports/discovery --ensure plans/breakouts
 */

const fs = require('fs/promises');
const path = require('path');
const {
  REPO_ROOT,
  CAPABILITIES_ROOT,
  OPTIONAL_SECTIONS,
  ensureTemplateExists,
  ensureOptionalSection,
  copyFromTemplate
} = require('./utils/capability-template');

function printUsage(message) {
  if (message) {
    console.error(`Error: ${message}`);
  }
  console.log('Usage: npm run baw:capability:structure -- --capability <slug|path> [options]');
  console.log('\nOptions:');
  console.log('  --list                       Show optional sections and whether they exist');
  console.log('  --ensure <section>           Copy a section from the template (repeatable)');
  console.log('  --help                       Display this message');
  process.exit(message ? 1 : 0);
}

function normalizeSection(input = '') {
  return input.replace(/^\/+/, '').replace(/\/+$/, '');
}

async function resolveCapabilityDir(input) {
  if (!input) {
    throw new Error('Capability slug or path is required.');
  }

  const candidates = [];
  if (path.isAbsolute(input)) {
    candidates.push(input);
  } else {
    candidates.push(path.join(CAPABILITIES_ROOT, input));
    candidates.push(path.join(REPO_ROOT, input));
  }

  for (const candidate of candidates) {
    const stats = await fs.stat(candidate).catch(() => null);
    if (stats && stats.isDirectory()) {
      return candidate;
    }
  }

  throw new Error(`Could not locate capability directory for "${input}".`);
}

async function listSections(capabilityDir) {
  console.log(`Capability: ${path.relative(REPO_ROOT, capabilityDir)}\n`);
  console.log('Optional sections:\n');
  const entries = Object.entries(OPTIONAL_SECTIONS);
  for (const [key, meta] of entries) {
    const sectionPath = path.join(capabilityDir, meta.source);
    const exists = await fs.stat(sectionPath).catch(() => null);
    const marker = exists ? '✔' : '·';
    console.log(` ${marker} ${key}`);
    console.log(`    ${meta.description}`);
  }
}

async function ensureSections(capabilityDir, sections) {
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
        await ensureOptionalSection(capabilityDir, section);
      } else {
        await copyFromTemplate(section, capabilityDir);
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
    capability: '',
    list: false,
    ensure: []
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      printUsage();
    } else if (arg === '--capability') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) {
        printUsage('Missing value for --capability');
      }
      config.capability = value;
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

  if (!config.capability) {
    printUsage('The --capability option is required.');
  }

  return config;
}

async function main() {
  try {
    const config = parseArgs();
    await ensureTemplateExists();
    const capabilityDir = await resolveCapabilityDir(config.capability);

    if (config.list) {
      await listSections(capabilityDir);
    }

    if (config.ensure.length > 0) {
      await ensureSections(capabilityDir, config.ensure);
    }

    if (!config.list && config.ensure.length === 0) {
      console.log('Nothing to do. Use --list or --ensure to modify the workspace.');
    }
  } catch (error) {
    console.error('❌ Failed to adjust capability structure');
    console.error(error.message || error);
    process.exit(1);
  }
}

main();
