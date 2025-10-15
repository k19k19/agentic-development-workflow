#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

const fg = require('fast-glob');

const REPO_ROOT = path.join(__dirname, '..', '..');
const CONFIG_PATH = path.join(
  REPO_ROOT,
  'ai-docs',
  'knowledge-ledger',
  'legacy-scan.config.json'
);

const DEFAULT_CONFIG = {
  legacyMarkers: ['@legacy', 'LEGACY_TODO', 'LEGACY-IMPL', 'LEGACY_FIXME'],
  forbiddenFragments: ['ai-docs/plans/', 'ai-docs/builds/', 'ai-docs/sessions/'],
  allowedFiles: [],
  ignoreGlobs: ['**/node_modules/**', '**/.git/**', '**/.idea/**', '**/.vscode/**']
};

const BINARY_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.pdf',
  '.zip',
  '.tar',
  '.gz',
  '.br',
  '.woff',
  '.woff2',
  '.ttf'
]);

function logError(message) {
  console.error(`[legacy-scan] ${message}`);
}

async function loadConfig() {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      legacyMarkers: Array.isArray(parsed.legacyMarkers)
        ? parsed.legacyMarkers
        : DEFAULT_CONFIG.legacyMarkers,
      forbiddenFragments: Array.isArray(parsed.forbiddenFragments)
        ? parsed.forbiddenFragments
        : DEFAULT_CONFIG.forbiddenFragments,
      allowedFiles: Array.isArray(parsed.allowedFiles)
        ? parsed.allowedFiles
        : DEFAULT_CONFIG.allowedFiles,
      ignoreGlobs: Array.isArray(parsed.ignoreGlobs)
        ? parsed.ignoreGlobs
        : DEFAULT_CONFIG.ignoreGlobs
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      logError(
        `Config not found at ${path.relative(REPO_ROOT, CONFIG_PATH)}. Falling back to defaults.`
      );
    } else if (error.name === 'SyntaxError') {
      logError(`Config parse error: ${error.message}. Falling back to defaults.`);
    } else {
      logError(`Unexpected config error: ${error.message}. Falling back to defaults.`);
    }
    return { ...DEFAULT_CONFIG };
  }
}

function isBinaryFile(filePath) {
  return BINARY_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function findLineNumbers(content, needle) {
  const lines = content.split(/\r?\n/);
  const matches = [];
  lines.forEach((line, index) => {
    if (line.includes(needle)) {
      matches.push(index + 1);
    }
  });
  return matches;
}

async function scanRepository(config) {
  const allowed = new Set(config.allowedFiles || []);
  const markers = config.legacyMarkers || [];
  const fragments = config.forbiddenFragments || [];
  const ignore = config.ignoreGlobs || [];

  const files = await fg('**/*', {
    cwd: REPO_ROOT,
    dot: false,
    onlyFiles: true,
    ignore
  });

  const findings = [];

  for (const relativePath of files) {
    if (isBinaryFile(relativePath)) {
      continue;
    }

    const normalizedPath = relativePath.replace(/\\/g, '/');

    if (allowed.has(normalizedPath)) {
      continue;
    }

    const filePath = path.join(REPO_ROOT, relativePath);
    let content;
    try {
      content = await fs.readFile(filePath, 'utf8');
    } catch (error) {
      logError(`Failed to read ${normalizedPath}: ${error.message}`);
      continue;
    }

    markers.forEach(marker => {
      if (marker && content.includes(marker)) {
        const lines = findLineNumbers(content, marker);
        if (lines.length > 0) {
          findings.push({
            type: 'marker',
            marker,
            file: normalizedPath,
            lines
          });
        }
      }
    });

    fragments.forEach(fragment => {
      if (fragment && content.includes(fragment)) {
        const lines = findLineNumbers(content, fragment);
        if (lines.length > 0) {
          findings.push({
            type: 'fragment',
            fragment,
            file: normalizedPath,
            lines
          });
        }
      }
    });
  }

  return findings;
}

function printFindings(findings) {
  if (findings.length === 0) {
    console.log('legacy-scan: no legacy markers or forbidden fragments detected.');
    return 0;
  }

  logError('Detected legacy markers or forbidden fragments:');
  findings.forEach(finding => {
    const lines = finding.lines.join(', ');
    if (finding.type === 'marker') {
      logError(
        `  marker "${finding.marker}" in ${finding.file}:${lines}`
      );
    } else {
      logError(
        `  fragment "${finding.fragment}" in ${finding.file}:${lines}`
      );
    }
  });
  return 1;
}

async function main() {
  const config = await loadConfig();
  const findings = await scanRepository(config);
  const exitCode = printFindings(findings);
  process.exit(exitCode);
}

main().catch(error => {
  logError(`Unexpected failure: ${error.stack || error.message}`);
  process.exit(1);
});
