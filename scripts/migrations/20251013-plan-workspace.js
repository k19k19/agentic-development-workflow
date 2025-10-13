#!/usr/bin/env node

const path = require('path');
const { glob } = require('glob');

const DESCRIPTION = 'Migrate legacy plans into feature workspaces';
const LEGACY_PLANS_DIR = ['ai-docs', 'plans'];
const PLAN_FILENAME_REGEX = /^\d{8}(?:-[0-9]{4,6})?-(.+)$/;

function toPosix(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function extractSlugHint(name, slugify) {
  const withoutExt = name.replace(/\.md$/i, '');
  const match = PLAN_FILENAME_REGEX.exec(withoutExt);
  if (match) {
    return slugify(match[1]);
  }
  return slugify(withoutExt);
}

function extractTimestampHint(name) {
  const withoutExt = name.replace(/\.md$/i, '');
  const match = withoutExt.match(/^(\d{8})(?:-([0-9]{4,6}))?-/);
  if (!match) {
    return null;
  }
  return {
    date: match[1],
    time: match[2] ? match[2].slice(0, 4).padEnd(4, '0') : '0000',
  };
}

function slugToTitle(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

async function collectLegacyPlans(context) {
  const { repoRoot, fs: safeFs, slugify } = context;
  const legacyRoot = path.join(repoRoot, ...LEGACY_PLANS_DIR);
  const directoryEntries = await safeFs
    .readdir(legacyRoot, { withFileTypes: true })
    .catch(error => {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    });

  const plans = [];
  for (const entry of directoryEntries) {
    if (entry.name.startsWith('.') || entry.name === 'plan-registry.json') {
      continue;
    }

    const entryPath = path.join(legacyRoot, entry.name);
    if (entry.isDirectory()) {
      const files = await safeFs.readdir(entryPath, { withFileTypes: true });
      for (const file of files) {
        if (!file.isFile() || !file.name.endsWith('.md')) {
          continue;
        }
        const sourcePath = path.join(entryPath, file.name);
        plans.push({
          sourcePath,
          relativeSource: toPosix(path.relative(repoRoot, sourcePath)),
          slugHint: extractSlugHint(entry.name, slugify),
          timestampHint: extractTimestampHint(entry.name),
        });
      }
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const sourcePath = entryPath;
      plans.push({
        sourcePath,
        relativeSource: toPosix(path.relative(repoRoot, sourcePath)),
        slugHint: extractSlugHint(entry.name, slugify),
        timestampHint: extractTimestampHint(entry.name),
      });
    }
  }

  return plans;
}

async function parsePlanMetadata(sourcePath, slugHint, context) {
  const { fs: safeFs, slugify } = context;
  const content = await safeFs.readFile(sourcePath, 'utf8');
  const featureMatch = content.match(/\*\*Feature ID:\*\*\s*([a-z0-9-_.]+)/i);
  const planDateMatch = content.match(/\*\*Plan Date:\*\*\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i);
  const titleMatch = content.match(/^#\s+(.+?)$/m);

  const slug = featureMatch ? slugify(featureMatch[1]) : slugHint;
  const planDate = planDateMatch ? planDateMatch[1] : null;
  const rawTitle = titleMatch ? titleMatch[1].trim() : slugToTitle(slug);
  const title = rawTitle.replace(/Implementation Plan$/i, '').trim() || rawTitle;

  return {
    slug,
    planDate,
    title,
    rawTitle,
    content,
  };
}

function determinePlanFilename(metadata, timestampHint, existingNames) {
  const datePart = metadata.planDate ? metadata.planDate.replace(/-/g, '') : timestampHint?.date || '';
  const timePart = timestampHint?.time || '0000';

  const base = datePart ? `PLAN-${datePart}-${timePart}` : `PLAN-${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12)}`;
  let candidate = `${base}.md`;
  let counter = 1;
  while (existingNames.has(candidate)) {
    candidate = `${base}-${counter}.md`;
    counter += 1;
  }
  existingNames.add(candidate);
  return candidate;
}

async function ensureChecklistItem(featureDir, relativePlanPath, metadata, context) {
  const { fs: safeFs } = context;
  const checklistPath = path.join(featureDir, 'plans', 'checklist.json');

  let checklist = {
    items: [],
    metadata: {
      lastUpdated: new Date().toISOString(),
      notes: 'Populate with plan slices using the scaffolding script or manually via /plan.',
    },
  };

  try {
    const raw = await safeFs.readFile(checklistPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      checklist = parsed;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  checklist.items = Array.isArray(checklist.items) ? checklist.items : [];
  const planId = relativePlanPath.replace(/^plans\//, '').replace(/\.md$/i, '');
  const legacyDescriptor = metadata.sourceRelative
    ? metadata.sourceRelative.replace(/^ai-docs\/plans\//, '')
    : metadata.slug || planId;
  const legacyNote = `Migrated from legacy ai-docs/plans (${legacyDescriptor})`;

  if (!checklist.items.find(item => item.planPath === relativePlanPath || item.id === planId)) {
    checklist.items.push({
      id: planId,
      title: metadata.title || planId,
      status: 'needs_validation',
      planPath: relativePlanPath,
      notes: [legacyNote],
      planDate: metadata.planDate || null,
    });
  }

  checklist.metadata = checklist.metadata || {};
  checklist.metadata.lastUpdated = new Date().toISOString();
  if (!checklist.metadata.notes) {
    checklist.metadata.notes = 'Populate with plan slices using the scaffolding script or manually via /plan.';
  }

  await safeFs.mkdir(path.dirname(checklistPath), { recursive: true });
  await safeFs.writeFile(checklistPath, `${JSON.stringify(checklist, null, 2)}\n`);
}

async function applyReplacements(context, replacements) {
  if (replacements.length === 0) {
    return [];
  }

  const { repoRoot, fs: safeFs } = context;
  const patterns = ['ai-docs/**/*.json', 'ai-docs/**/*.md'];
  const filesToUpdate = new Set();
  for (const pattern of patterns) {
    const matches = await glob(pattern, { cwd: repoRoot, nodir: true });
    matches.forEach(match => filesToUpdate.add(path.join(repoRoot, match)));
  }

  const changedFiles = [];
  for (const filePath of filesToUpdate) {
    let content = await safeFs.readFile(filePath, 'utf8');
    let updated = content;
    for (const { from, to } of replacements) {
      updated = updated.split(from).join(to);
    }
    if (updated !== content) {
      await safeFs.writeFile(filePath, updated);
      changedFiles.push(toPosix(path.relative(repoRoot, filePath)));
    }
  }

  return changedFiles;
}

async function run(context) {
  const plans = await collectLegacyPlans(context);
  if (plans.length === 0) {
    return { summary: 'No legacy plans detected.' };
  }

  const { scaffoldFeature, slugify, repoRoot, fs: safeFs } = context;
  const summary = {
    migratedPlans: [],
    createdFeatures: [],
    updatedFiles: [],
  };
  const replacements = [];
  const featurePlanNames = new Map();

  for (const plan of plans) {
    const metadata = await parsePlanMetadata(plan.sourcePath, plan.slugHint, context);
    if (!metadata.slug) {
      context.log(`Skipping ${plan.relativeSource} (unable to determine feature slug).`);
      continue;
    }

    const config = {
      title: metadata.title || slugToTitle(metadata.slug),
      slug: metadata.slug,
      status: 'draft',
      stage: 'planning',
      maxPlanTokens: 2000,
      token: 0,
    };

    const { featureDir, created } = await scaffoldFeature(config, { allowExisting: true, refreshMetadata: true });
    if (created) {
      summary.createdFeatures.push(toPosix(path.relative(repoRoot, featureDir)));
    }

    const namesForFeature = featurePlanNames.get(metadata.slug) || new Set();
    featurePlanNames.set(metadata.slug, namesForFeature);
    const planFilename = determinePlanFilename(metadata, plan.timestampHint, namesForFeature);
    const destPath = path.join(featureDir, 'plans', planFilename);

    await safeFs.mkdir(path.dirname(destPath), { recursive: true });
    await safeFs.writeFile(destPath, metadata.content);

    const relativeDest = toPosix(path.relative(repoRoot, destPath));
    replacements.push({
      from: plan.relativeSource,
      to: relativeDest,
    });
    await ensureChecklistItem(featureDir, toPosix(path.relative(featureDir, destPath)), {
      ...metadata,
      sourceRelative: plan.relativeSource,
    }, context);

    summary.migratedPlans.push({
      from: plan.relativeSource,
      to: relativeDest,
    });
  }

  const changedFiles = await applyReplacements(context, replacements);
  summary.updatedFiles = changedFiles;

  return {
    summary: `Migrated ${summary.migratedPlans.length} plan${summary.migratedPlans.length === 1 ? '' : 's'}.`,
    details: summary,
  };
}

async function shouldRun(context) {
  const plans = await collectLegacyPlans(context);
  return plans.length > 0;
}

module.exports = {
  id: '20251013-plan-workspace',
  description: DESCRIPTION,
  shouldRun,
  run,
};
