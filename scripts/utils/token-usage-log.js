#!/usr/bin/env node

/**
 * Manual token usage logger.
 *
 * Usage examples:
 *   node scripts/utils/token-usage-log.js --claude 12000 --gemini 3000 --note "Discovery build"
 *   node scripts/utils/token-usage-log.js --total 18000 --task TASK-123 --note "Plan + build"
 *
 * When `--total` is omitted the script sums the model-specific values.
 */

const fs = require('fs').promises;
const path = require('path');
const { normalizeTokens } = require('./token-budget-calculator');

const LOG_PATH = path.join(__dirname, '../../ai-docs/workflow/token-usage.jsonl');

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

    result[key] = value;
  }
  return result;
}

function buildEntry(args) {
  const timestamp = args.timestamp ? new Date(args.timestamp) : new Date();
  if (Number.isNaN(timestamp.getTime())) {
    throw new Error(`Invalid --timestamp value: ${args.timestamp}`);
  }

  const note = typeof args.note === 'string' ? args.note : undefined;
  const taskId = typeof args.task === 'string' ? args.task : undefined;
  const sessionId = typeof args.session === 'string' ? args.session : undefined;
  const source = typeof args.source === 'string' ? args.source : 'manual';

  const models = ['claude', 'gemini', 'codex', 'openai', 'other'];
  const byModel = {};

  models.forEach(model => {
    if (args[model] !== undefined && args[model] !== true) {
      const value = normalizeTokens(args[model]);
      if (value > 0) {
        byModel[model] = { total: value };
      }
    }
  });

  let total = args.total !== undefined && args.total !== true ? normalizeTokens(args.total) : 0;
  const modelTotal = Object.values(byModel).reduce((sum, item) => sum + (item.total || 0), 0);

  if (total === 0) {
    total = modelTotal;
  }

  if (total === 0) {
    throw new Error('No token values provided. Supply --total or model-specific flags such as --claude 12000.');
  }

  if (modelTotal > 0 && total < modelTotal) {
    total = modelTotal;
  }

  const entry = {
    timestamp: timestamp.toISOString(),
    source,
    tokens: {
      total,
      byModel
    }
  };

  if (note) {
    entry.note = note;
  }

  if (taskId) {
    entry.taskId = taskId;
  }

  if (sessionId) {
    entry.sessionId = sessionId;
  }

  return entry;
}

async function ensureLogDirectory() {
  const directory = path.dirname(LOG_PATH);
  await fs.mkdir(directory, { recursive: true });
}

async function appendEntry(entry) {
  const line = `${JSON.stringify(entry)}\n`;
  await ensureLogDirectory();
  await fs.appendFile(LOG_PATH, line, { encoding: 'utf8' });
}

async function main() {
  try {
    const args = parseArguments(process.argv.slice(2));
    if (Object.keys(args).length === 0) {
      console.error('No arguments supplied. Example: --claude 12000 --gemini 3000 --note "Discovery build"');
      process.exit(1);
    }

    const entry = buildEntry(args);
    await appendEntry(entry);
    console.log(`✅ Logged ${entry.tokens.total.toLocaleString('en-US')} tokens (${Object.keys(entry.tokens.byModel).length} model entries) at ${entry.timestamp}.`);
    if (entry.note) {
      console.log(`   Note: ${entry.note}`);
    }
    if (entry.taskId) {
      console.log(`   Task: ${entry.taskId}`);
    }
    if (entry.sessionId) {
      console.log(`   Session: ${entry.sessionId}`);
    }
  } catch (error) {
    console.error(`❌ Failed to log token usage: ${error.message}`);
    process.exit(1);
  }
}

main();
