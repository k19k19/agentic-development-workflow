#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const { REPO_ROOT, scaffoldFeature, slugify, FEATURES_ROOT } = require('./utils/feature-scaffold');

const MIGRATIONS_ROOT = path.join(__dirname, 'migrations');
const STATE_DIR = path.join(REPO_ROOT, 'ai-docs', 'workflow', 'migrations');
const STATE_FILE = path.join(STATE_DIR, 'applied.json');

async function loadState() {
  try {
    const raw = await fs.readFile(STATE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.migrations) {
      return parsed;
    }
    return { migrations: {} };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { migrations: {} };
    }
    throw error;
  }
}

async function saveState(state) {
  await fs.mkdir(STATE_DIR, { recursive: true });
  await fs.writeFile(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`);
}

async function loadMigrations() {
  const entries = await fs
    .readdir(MIGRATIONS_ROOT, { withFileTypes: true })
    .catch(error => {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    });

  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.js') && !entry.name.startsWith('_'))
    .map(entry => {
      const migrationPath = path.join(MIGRATIONS_ROOT, entry.name);
      /* eslint-disable global-require, import/no-dynamic-require */
      const migration = require(migrationPath);
      /* eslint-enable global-require, import/no-dynamic-require */
      if (!migration || typeof migration !== 'object') {
        throw new Error(`Migration ${entry.name} must export an object`);
      }
      const id = migration.id || path.basename(entry.name, '.js');
      return { ...migration, id, file: migrationPath };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

async function runMigration(migration, context, state) {
  const now = new Date().toISOString();
  state.migrations[migration.id] = {
    status: 'running',
    startedAt: now,
    summary: migration.description || '',
  };
  await saveState(state);

  try {
    const shouldRun = migration.shouldRun ? await migration.shouldRun(context) : true;
    if (!shouldRun) {
      state.migrations[migration.id] = {
        status: 'skipped',
        startedAt: now,
        completedAt: new Date().toISOString(),
        summary: migration.description || '',
      };
      await saveState(state);
      console.log(`↷ Skipped ${migration.id} (no changes needed)`);
      return;
    }

    const result = await migration.run(context);
    state.migrations[migration.id] = {
      status: 'completed',
      startedAt: now,
      completedAt: new Date().toISOString(),
      summary: result?.summary || migration.description || '',
      details: result?.details || result?.changes || null,
    };
    await saveState(state);
    const completionSummary = state.migrations[migration.id].summary || 'Completed';
    console.log(`✔ ${migration.id}: ${completionSummary}`);
  } catch (error) {
    state.migrations[migration.id] = {
      status: 'failed',
      startedAt: now,
      failedAt: new Date().toISOString(),
      summary: migration.description || '',
      error: error.message,
    };
    await saveState(state);
    throw error;
  }
}

async function main() {
  try {
    const migrations = await loadMigrations();
    if (migrations.length === 0) {
      console.log('No migrations found. You are up to date.');
      return;
    }

    const state = await loadState();
    const pending = migrations.filter(migration => {
      const entry = state.migrations[migration.id];
      return !entry || entry.status !== 'completed';
    });

    if (pending.length === 0) {
      console.log('All migrations have already been applied.');
      return;
    }

    const context = {
      repoRoot: REPO_ROOT,
      featuresRoot: FEATURES_ROOT,
      migrationsRoot: MIGRATIONS_ROOT,
      stateDir: STATE_DIR,
      fs,
      path,
      scaffoldFeature,
      slugify,
      log: message => console.log(`   ${message}`),
    };

    console.log(`Applying ${pending.length} migration${pending.length === 1 ? '' : 's'}...`);
    for (const migration of pending) {
      console.log(`→ ${migration.id}: ${migration.description || 'Running migration'}`);
      await runMigration(migration, context, state);
    }
    console.log('✅ Migration complete.');
  } catch (error) {
    console.error(`❌ Migration failed: ${error.message}`);
    process.exit(1);
  }
}

main();
