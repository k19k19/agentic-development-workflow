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

const path = require('path');
const { scaffoldFeature, slugify } = require('./utils/feature-scaffold');

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
    } else {
      printUsage(`Unknown option: --${key}`);
    }
  }

  if (!config.title) {
    printUsage('The --title option is required.');
  }

  return config;
}

async function main() {
  try {
    const config = parseArgs();
    if (!config.title) {
      printUsage('The --title option is required.');
    }
    const resolvedConfig = {
      ...config,
      slug: config.slug ? slugify(config.slug) : undefined,
    };

    const { featureDir, created } = await scaffoldFeature(resolvedConfig, { allowExisting: false });
    console.log(`✔ Created feature workspace at ${path.relative(process.cwd(), featureDir)}`);
    console.log('Next steps:');
    console.log('  1. Fill in intake/requirements.md with the problem statement.');
    console.log('  2. Draft the first plan slice in plans/checklist.json and run /plan.');
    console.log('  3. Record the decision in the knowledge ledger if this is a new initiative.');
    console.log('  4. When /scout uncovers missing context, update the same plan/checklist/backlog entries instead of scaffolding another feature.');
    if (!created) {
      console.log('  5. Existing workspace detected; metadata refreshed.');
    }
  } catch (error) {
    console.error(`Failed to scaffold feature: ${error.message}`);
    process.exit(1);
  }
}

main();
