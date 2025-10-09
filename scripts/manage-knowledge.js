#!/usr/bin/env node

/**
 * Manage knowledge lifecycle for docs indexed in the vector store.
 *
 * Usage examples:
 *   npm run manage-knowledge -- list
 *   npm run manage-knowledge -- archive round5-caching.md
 *   npm run manage-knowledge -- restore round5-caching.md
 *   npm run manage-knowledge -- refresh
 */

const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const SPECS_ROOT = path.join(REPO_ROOT, 'app-docs', 'specs');
const ACTIVE_DIR = path.join(SPECS_ROOT, 'active');
const ARCHIVE_DIR = path.join(SPECS_ROOT, 'archive');
const REFERENCE_DIR = path.join(SPECS_ROOT, 'reference');

async function ensureDirectories() {
  await Promise.all([
    fs.mkdir(ACTIVE_DIR, { recursive: true }),
    fs.mkdir(ARCHIVE_DIR, { recursive: true }),
    fs.mkdir(REFERENCE_DIR, { recursive: true }),
  ]);
}

function printUsage() {
  console.log('Usage: node scripts/manage-knowledge.js <command> [args]');
  console.log('Commands:');
  console.log('  list                     Show specs in active/archive/reference');
  console.log('  archive <file>           Move a spec from active/ to archive/ and re-vectorize');
  console.log('  restore <file>           Move a spec from archive/ back to active/ and re-vectorize');
  console.log('  refresh                  Re-run npm run vectorize without moving files');
}

async function listSpecs() {
  const formatList = async (dir) => {
    try {
      const entries = await fs.readdir(dir);
      if (!entries.length) {
        return '  (empty)';
      }
      return entries
        .sort((a, b) => a.localeCompare(b))
        .map((entry) => `  - ${entry}`)
        .join('\n');
    } catch (error) {
      if (error.code === 'ENOENT') {
        return '  (missing)';
      }
      throw error;
    }
  };

  console.log('Specs inventory:\n');
  console.log('active/');
  console.log(await formatList(ACTIVE_DIR));
  console.log('\narchive/');
  console.log(await formatList(ARCHIVE_DIR));
  console.log('\nreference/');
  console.log(await formatList(REFERENCE_DIR));
}

async function runVectorize() {
  await new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', 'vectorize'], {
      cwd: REPO_ROOT,
      stdio: 'inherit',
    });
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Vectorize script exited with code ${code}`));
      }
    });
    child.on('error', (error) => reject(error));
  });
}

async function resolveSpecPath(input, expectedRoot) {
  const candidates = [];
  if (path.isAbsolute(input)) {
    candidates.push(input);
  } else {
    candidates.push(path.join(expectedRoot, input));
    candidates.push(path.join(REPO_ROOT, input));
  }

  for (const candidate of candidates) {
    try {
      const stats = await fs.stat(candidate);
      if (stats.isFile()) {
        const relative = path.relative(expectedRoot, candidate);
        if (relative.startsWith('..')) {
          throw new Error(`File ${candidate} is not inside ${expectedRoot}`);
        }
        return { absolute: candidate, relative };
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  throw new Error(`Could not locate spec "${input}" within ${expectedRoot}`);
}

async function moveSpec({ sourceDir, targetDir, file }) {
  await ensureDirectories();
  const { absolute, relative } = await resolveSpecPath(file, sourceDir);
  const destination = path.join(targetDir, relative);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  try {
    await fs.stat(destination);
    throw new Error(`Destination already has a file named ${relative}`);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
  await fs.rename(absolute, destination);
  return { movedFrom: absolute, movedTo: destination };
}

async function archiveSpec(file) {
  const result = await moveSpec({ sourceDir: ACTIVE_DIR, targetDir: ARCHIVE_DIR, file });
  console.log(`Archived ${path.relative(REPO_ROOT, result.movedFrom)} -> ${path.relative(REPO_ROOT, result.movedTo)}`);
  await runVectorize();
}

async function restoreSpec(file) {
  const result = await moveSpec({ sourceDir: ARCHIVE_DIR, targetDir: ACTIVE_DIR, file });
  console.log(`Restored ${path.relative(REPO_ROOT, result.movedFrom)} -> ${path.relative(REPO_ROOT, result.movedTo)}`);
  await runVectorize();
}

async function main() {
  const [command, file] = process.argv.slice(2);
  if (!command) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  try {
    switch (command) {
      case 'list':
        await ensureDirectories();
        await listSpecs();
        break;
      case 'archive':
        if (!file) {
          throw new Error('archive command expects a file name (e.g., round5-caching.md)');
        }
        await archiveSpec(file);
        break;
      case 'restore':
        if (!file) {
          throw new Error('restore command expects a file name (e.g., round5-caching.md)');
        }
        await restoreSpec(file);
        break;
      case 'refresh':
        await ensureDirectories();
        await runVectorize();
        break;
      default:
        throw new Error(`Unknown command "${command}"`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

main();
