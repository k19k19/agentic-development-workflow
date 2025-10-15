#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..', '..');
const FEATURES_ROOT = path.join(REPO_ROOT, 'ai-docs', 'workflow', 'features');
const TEMPLATE_ROOT = path.join(FEATURES_ROOT, '_template');

const MINIMAL_FILES = [
  'README.md',
  'feature-manifest.json',
  'intake/README.md',
  'intake/requirements.md',
  'intake/product/README.md',
  'intake/personas/README.md',
  'intake/support/README.md',
  'intake/tasks/README.md',
  'sessions/README.md',
  'sessions/session-backlog.json',
  'plans/README.md',
  'plans/checklist.json',
  'reports/README.md',
  'workflow/README.md',
  'builds/README.md',
  'handoff/README.md',
  'artifacts/README.md'
];

const OPTIONAL_SECTIONS = {
  'plans/breakouts': {
    source: 'plans/breakouts',
    description: 'Sprint-sized breakout plans and backlog slices.'
  },
  'plans/dependency': {
    source: 'plans/dependency',
    description: 'Dependency mapping assets for large initiatives.'
  },
  'plans/deployment': {
    source: 'plans/deployment',
    description: 'Deployment preparation notes and coordination checklists.'
  },
  'reports/discovery': {
    source: 'reports/discovery',
    description: 'Discovery transcripts, research notes, and context captures.'
  },
  'reports/tests': {
    source: 'reports/tests',
    description: 'Automated test evidence and summaries.'
  },
  'reports/test-matrices': {
    source: 'reports/test-matrices',
    description: 'Structured test matrices and coverage expectations.'
  },
  'reports/uat': {
    source: 'reports/uat',
    description: 'User-acceptance testing notes and approvals.'
  },
  'reports/deployments': {
    source: 'reports/deployments',
    description: 'Deployment logs, runbooks, and rollback records.'
  },
  'reports/review': {
    source: 'reports/review',
    description: 'Code review notes and quality findings.'
  },
  'reports/ops': {
    source: 'reports/ops',
    description: 'Operational runbooks, playbooks, and on-call notes.'
  },
  'reports/failures': {
    source: 'reports/failures',
    description: 'Incident postmortems and failure analysis.'
  }
};

async function ensureTemplateExists() {
  const stats = await fs.stat(TEMPLATE_ROOT).catch(() => null);
  if (!stats || !stats.isDirectory()) {
    throw new Error('Template directory is missing. Expected at ai-docs/workflow/features/_template');
  }
}

async function copyRecursive(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyRecursive(srcPath, destPath);
    } else {
      const data = await fs.readFile(srcPath);
      await fs.writeFile(destPath, data);
    }
  }
}

async function copyFromTemplate(relativePath, destinationRoot) {
  const source = path.join(TEMPLATE_ROOT, relativePath);
  const dest = path.join(destinationRoot, relativePath);

  const stats = await fs.stat(source).catch(() => null);
  if (!stats) {
    throw new Error(`Template asset "${relativePath}" does not exist under _template`);
  }

  if (stats.isDirectory()) {
    await copyRecursive(source, dest);
  } else {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    const content = await fs.readFile(source);
    await fs.writeFile(dest, content);
  }
}

async function ensureOptionalSection(featureDir, sectionKey) {
  const meta = OPTIONAL_SECTIONS[sectionKey];
  if (!meta) {
    throw new Error(`Unknown optional section "${sectionKey}".`);
  }
  await copyFromTemplate(meta.source, featureDir);
  return meta;
}

async function copyTemplateTree(destinationRoot) {
  await copyRecursive(TEMPLATE_ROOT, destinationRoot);
}

module.exports = {
  REPO_ROOT,
  FEATURES_ROOT,
  TEMPLATE_ROOT,
  MINIMAL_FILES,
  OPTIONAL_SECTIONS,
  ensureTemplateExists,
  copyFromTemplate,
  ensureOptionalSection,
  copyTemplateTree
};
