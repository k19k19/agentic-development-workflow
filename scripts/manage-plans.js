#!/usr/bin/env node

/**
 * Plan Management System
 *
 * Tracks implementation plans, their status, and linkage to tasks.
 * Solves the problem of multiple plan files with unclear status.
 */

const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

const PLANS_DIR = path.join(__dirname, '../ai-docs/plans');
const REGISTRY_FILE = path.join(PLANS_DIR, 'plan-registry.json');

// Plan statuses
const STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
  SUPERSEDED: 'superseded'
};

// Default registry structure
const DEFAULT_REGISTRY = {
  version: '1.0',
  lastUpdated: new Date().toISOString(),
  plans: []
};

/**
 * Load plan registry
 */
async function loadRegistry() {
  try {
    const content = await fs.readFile(REGISTRY_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Create new registry if it doesn't exist
      await saveRegistry(DEFAULT_REGISTRY);
      return DEFAULT_REGISTRY;
    }
    throw error;
  }
}

/**
 * Save plan registry
 */
async function saveRegistry(registry) {
  registry.lastUpdated = new Date().toISOString();
  await fs.mkdir(path.dirname(REGISTRY_FILE), { recursive: true });
  await fs.writeFile(REGISTRY_FILE, JSON.stringify(registry, null, 2));
}

/**
 * Scan plans directory and discover all plan files
 */
async function scanPlans() {
  const planDirs = await glob(`${PLANS_DIR}/*/plan.md`);

  const plans = [];
  for (const planPath of planDirs) {
    const dirName = path.basename(path.dirname(planPath));
    const content = await fs.readFile(planPath, 'utf8');

    // Extract metadata from plan markdown
    const titleMatch = content.match(/^#\s+(?:Implementation Plan:\s*)?(.+)$/m);
    const dateMatch = content.match(/\*\*(?:Date|Created)\*\*:\s*(\d{4}-\d{2}-\d{2})/);
    const tokensMatch = content.match(/\*\*(?:Estimated (?:Effort|Tokens)|Token Budget)\*\*:\s*[~]?(\d+)(K)?/i);
    const complexityMatch = content.match(/\*\*Complexity\*\*:\s*(\w+)/i);

    plans.push({
      planId: dirName,
      planPath: planPath,
      title: titleMatch ? titleMatch[1].trim() : dirName,
      createdAt: dateMatch ? `${dateMatch[1]}T00:00:00Z` : null,
      estimatedTokens: tokensMatch ? parseInt(tokensMatch[1]) * (tokensMatch[2] === 'K' ? 1000 : 1) : null,
      complexity: complexityMatch ? complexityMatch[1].toLowerCase() : 'unknown'
    });
  }

  return plans.sort((a, b) => a.planId.localeCompare(b.planId));
}

/**
 * Initialize registry by scanning existing plans
 */
async function initRegistry() {
  console.log('🔍 Scanning for plan files...');

  const discoveredPlans = await scanPlans();
  const registry = await loadRegistry();

  let addedCount = 0;

  for (const plan of discoveredPlans) {
    const exists = registry.plans.find(p => p.planId === plan.planId);

    if (!exists) {
      registry.plans.push({
        planId: plan.planId,
        title: plan.title,
        status: STATUS.PENDING,
        taskId: null,
        planPath: plan.planPath,
        createdAt: plan.createdAt || new Date().toISOString(),
        priority: 'medium',
        estimatedTokens: plan.estimatedTokens,
        complexity: plan.complexity,
        notes: null
      });
      addedCount++;
      console.log(`  ✅ Added: ${plan.planId}`);
    }
  }

  await saveRegistry(registry);

  console.log(`\n✅ Registry initialized`);
  console.log(`   Found: ${discoveredPlans.length} plans`);
  console.log(`   Added: ${addedCount} new plans`);

  return registry;
}

/**
 * Sync registry with plan files (update metadata)
 */
async function syncRegistry() {
  console.log('🔄 Syncing plan metadata from files...');

  const discoveredPlans = await scanPlans();
  const registry = await loadRegistry();

  let updatedCount = 0;
  let missingCount = 0;

  // Update existing plans with fresh metadata
  for (const plan of discoveredPlans) {
    const existing = registry.plans.find(p => p.planId === plan.planId);

    if (existing) {
      // Update metadata but preserve status, taskId, priority, notes
      const changed =
        existing.title !== plan.title ||
        existing.estimatedTokens !== plan.estimatedTokens ||
        existing.complexity !== plan.complexity;

      if (changed) {
        existing.title = plan.title;
        existing.estimatedTokens = plan.estimatedTokens;
        existing.complexity = plan.complexity;
        existing.updatedAt = new Date().toISOString();
        updatedCount++;
        console.log(`  🔄 Updated: ${plan.planId}`);
      }
    }
  }

  // Check for plans in registry that no longer have files
  for (const registryPlan of registry.plans) {
    const stillExists = discoveredPlans.find(p => p.planId === registryPlan.planId);
    if (!stillExists && registryPlan.status !== STATUS.COMPLETED) {
      console.log(`  ⚠️  Missing file: ${registryPlan.planId} (${registryPlan.status})`);
      missingCount++;
    }
  }

  await saveRegistry(registry);

  console.log(`\n✅ Sync complete`);
  console.log(`   Total plans: ${discoveredPlans.length}`);
  console.log(`   Updated: ${updatedCount}`);
  if (missingCount > 0) {
    console.log(`   ⚠️  Missing files: ${missingCount}`);
  }

  return registry;
}

/**
 * List all plans with their status
 */
async function listPlans(filterStatus = null) {
  const registry = await loadRegistry();

  let plans = registry.plans;
  if (filterStatus) {
    plans = plans.filter(p => p.status === filterStatus);
  }

  if (plans.length === 0) {
    console.log('No plans found.');
    return;
  }

  console.log('\n📋 IMPLEMENTATION PLANS\n');
  console.log('━'.repeat(80));

  // Group by status
  const grouped = {
    [STATUS.IN_PROGRESS]: [],
    [STATUS.PENDING]: [],
    [STATUS.COMPLETED]: [],
    [STATUS.ABANDONED]: [],
    [STATUS.SUPERSEDED]: []
  };

  plans.forEach(plan => {
    grouped[plan.status].push(plan);
  });

  // Display each group
  const statusIcons = {
    [STATUS.IN_PROGRESS]: '🚧',
    [STATUS.PENDING]: '⚪',
    [STATUS.COMPLETED]: '✅',
    [STATUS.ABANDONED]: '🗑️',
    [STATUS.SUPERSEDED]: '📦'
  };

  const statusLabels = {
    [STATUS.IN_PROGRESS]: 'IN PROGRESS',
    [STATUS.PENDING]: 'PENDING',
    [STATUS.COMPLETED]: 'COMPLETED',
    [STATUS.ABANDONED]: 'ABANDONED',
    [STATUS.SUPERSEDED]: 'SUPERSEDED'
  };

  for (const [status, statusPlans] of Object.entries(grouped)) {
    if (statusPlans.length === 0) continue;

    console.log(`\n${statusIcons[status]} ${statusLabels[status]} (${statusPlans.length})`);
    console.log('─'.repeat(80));

    statusPlans.forEach(plan => {
      console.log(`\n  ${plan.planId}`);
      console.log(`  ${plan.title}`);
      if (plan.taskId) {
        console.log(`  Task: ${plan.taskId}`);
      }
      if (plan.estimatedTokens) {
        console.log(`  Estimated: ${plan.estimatedTokens.toLocaleString()} tokens`);
      }
      if (plan.notes) {
        console.log(`  Notes: ${plan.notes}`);
      }
    });
  }

  console.log('\n' + '━'.repeat(80) + '\n');

  // Summary
  console.log('📊 SUMMARY\n');
  console.log(`  Total plans: ${plans.length}`);
  console.log(`  In progress: ${grouped[STATUS.IN_PROGRESS].length}`);
  console.log(`  Pending: ${grouped[STATUS.PENDING].length}`);
  console.log(`  Completed: ${grouped[STATUS.COMPLETED].length}\n`);
}

/**
 * Update plan status
 */
async function updateStatus(planId, newStatus, notes = null) {
  const registry = await loadRegistry();
  const plan = registry.plans.find(p => p.planId === planId);

  if (!plan) {
    console.error(`❌ Plan not found: ${planId}`);
    process.exit(1);
  }

  const oldStatus = plan.status;
  plan.status = newStatus;
  plan.updatedAt = new Date().toISOString();

  if (notes) {
    plan.notes = notes;
  }

  await saveRegistry(registry);

  console.log(`✅ Plan status updated`);
  console.log(`   Plan: ${planId}`);
  console.log(`   ${oldStatus} → ${newStatus}`);
  if (notes) {
    console.log(`   Notes: ${notes}`);
  }
}

/**
 * Link plan to task
 */
async function linkTask(planId, taskId) {
  const registry = await loadRegistry();
  const plan = registry.plans.find(p => p.planId === planId);

  if (!plan) {
    console.error(`❌ Plan not found: ${planId}`);
    process.exit(1);
  }

  plan.taskId = taskId;
  plan.status = STATUS.IN_PROGRESS;
  plan.updatedAt = new Date().toISOString();

  await saveRegistry(registry);

  console.log(`✅ Plan linked to task`);
  console.log(`   Plan: ${planId}`);
  console.log(`   Task: ${taskId}`);
  console.log(`   Status: ${plan.status}`);
}

/**
 * Mark plan as completed
 */
async function completePlan(planId) {
  await updateStatus(planId, STATUS.COMPLETED, 'Implementation completed');
}

/**
 * Show what's next based on priorities and status
 */
async function showNext() {
  const registry = await loadRegistry();

  const pending = registry.plans.filter(p => p.status === STATUS.PENDING);
  const inProgress = registry.plans.filter(p => p.status === STATUS.IN_PROGRESS);

  console.log('\n🎯 WHAT\'S NEXT?\n');
  console.log('━'.repeat(80));

  if (inProgress.length > 0) {
    console.log('\n🚧 IN PROGRESS\n');
    inProgress.forEach(plan => {
      console.log(`  ${plan.planId}`);
      console.log(`  ${plan.title}`);
      if (plan.taskId) {
        console.log(`  Task: ${plan.taskId}`);
      }
      console.log(`  Action: Continue working or complete\n`);
    });
  }

  if (pending.length > 0) {
    console.log('\n⚪ RECOMMENDED NEXT STEPS\n');

    // Sort by priority and estimated tokens
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const sorted = pending.sort((a, b) => {
      const priorityDiff = (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
      if (priorityDiff !== 0) return priorityDiff;
      return (a.estimatedTokens || 0) - (b.estimatedTokens || 0);
    });

    sorted.slice(0, 3).forEach((plan, idx) => {
      console.log(`  ${idx + 1}. ${plan.planId}`);
      console.log(`     ${plan.title}`);
      console.log(`     Priority: ${plan.priority} | Tokens: ${plan.estimatedTokens?.toLocaleString() || 'unknown'}`);
      console.log(`     Action: /build "ai-docs/plans/${plan.planId}/plan.md"\n`);
    });
  }

  if (inProgress.length === 0 && pending.length === 0) {
    console.log('\n✨ All plans are complete! Time to celebrate or create new plans.\n');
  }

  console.log('━'.repeat(80) + '\n');
}

/**
 * CLI interface
 */
async function main() {
  const [,, command, ...args] = process.argv;

  try {
    switch (command) {
      case 'init':
        await initRegistry();
        break;

      case 'sync':
        await syncRegistry();
        break;

      case 'list':
        const filterStatus = args[0];
        await listPlans(filterStatus);
        break;

      case 'update':
        const [planId, status, ...notesParts] = args;
        const notes = notesParts.join(' ') || null;
        await updateStatus(planId, status, notes);
        break;

      case 'link':
        await linkTask(args[0], args[1]);
        break;

      case 'complete':
        await completePlan(args[0]);
        break;

      case 'next':
        await showNext();
        break;

      default:
        console.log(`
Plan Management Commands:

  node scripts/manage-plans.js init
    Scan plans directory and initialize registry

  node scripts/manage-plans.js sync
    Update existing plan metadata from markdown files

  node scripts/manage-plans.js list [status]
    List all plans (optionally filter by status)

  node scripts/manage-plans.js update <plan-id> <status> [notes]
    Update plan status (pending|in_progress|completed|abandoned|superseded)

  node scripts/manage-plans.js link <plan-id> <task-id>
    Link plan to a task and mark as in_progress

  node scripts/manage-plans.js complete <plan-id>
    Mark plan as completed

  node scripts/manage-plans.js next
    Show recommended next steps

Status values: pending, in_progress, completed, abandoned, superseded
        `);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  loadRegistry,
  saveRegistry,
  scanPlans,
  initRegistry,
  syncRegistry,
  listPlans,
  updateStatus,
  linkTask,
  completePlan,
  showNext,
  STATUS
};
