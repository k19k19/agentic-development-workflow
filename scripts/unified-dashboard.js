#!/usr/bin/env node

/**
 * Unified Dashboard
 *
 * Combines plans and tasks into a single view with actionable commands
 */

const path = require('path');
const {loadRegistry} = require('./manage-plans');
const fs = require('fs').promises;

const TASKS_FILE = path.join(__dirname, '../ai-docs/tasks/tasks.json');

async function loadTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {tasks: [], tokenBudget: {used: 0, dailyLimit: 500000, remaining: 500000}};
    }
    throw error;
  }
}

function createProgressBar(current, total, width = 30) {
  const percent = Math.min(current / total, 1);
  const filled = Math.floor(percent * width);
  const empty = width - filled;
  return `[${'\u2588'.repeat(filled)}${'\u2591'.repeat(empty)}]`;
}

async function showUnifiedDashboard() {
  const plans = await loadRegistry();
  const tasks = await loadTasks();

  // Token budget
  const budgetPercent = ((tasks.tokenBudget.used / tasks.tokenBudget.dailyLimit) * 100).toFixed(1);
  const budgetBar = createProgressBar(tasks.tokenBudget.used, tasks.tokenBudget.dailyLimit, 30);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎯 UNIFIED DASHBOARD');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Token Budget
  console.log('💰 TOKEN BUDGET (Daily)');
  console.log(`   Used: ${tasks.tokenBudget.used.toLocaleString()} / ${tasks.tokenBudget.dailyLimit.toLocaleString()} (${budgetPercent}%)`);
  console.log(`   ${budgetBar}`);
  console.log(`   Remaining: ${tasks.tokenBudget.remaining.toLocaleString()} tokens`);

  if (parseFloat(budgetPercent) >= 90) {
    console.log('   🚨 CRITICAL: Consider resuming tomorrow');
  } else if (parseFloat(budgetPercent) >= 75) {
    console.log('   ⚠️  WARNING: Budget running low');
  }
  console.log('');

  // Combine plans and tasks
  const inProgressPlans = plans.plans.filter(p => p.status === 'in_progress');
  const pendingPlans = plans.plans.filter(p => p.status === 'pending');
  const activeTasks = tasks.tasks?.filter(t => t.state !== 'completed' && t.state !== 'cancelled') || [];
  const pausedTasks = activeTasks.filter(t => t.state === 'paused');
  const inProgressTasks = activeTasks.filter(t => t.state === 'in_progress');
  const pendingTasks = activeTasks.filter(t => t.state === 'pending');

  // IN PROGRESS
  if (inProgressPlans.length > 0 || inProgressTasks.length > 0) {
    console.log('🚧 IN PROGRESS\n');

    inProgressPlans.forEach(plan => {
      console.log(`   📋 Plan: ${plan.title}`);
      console.log(`      ID: ${plan.planId}`);
      if (plan.estimatedTokens) {
        console.log(`      Tokens: ~${plan.estimatedTokens.toLocaleString()}`);
      }
      console.log(`      ▶️  CONTINUE: /build "ai-docs/plans/${plan.planId}/plan.md"`);
      console.log(`      ✅ COMPLETE: npm run plans:complete ${plan.planId}\n`);
    });

    inProgressTasks.forEach(task => {
      console.log(`   📌 Task: ${task.title}`);
      console.log(`      ID: ${task.id}`);
      console.log(`      Tokens: ~${task.estimatedTokens.toLocaleString()}`);
      console.log(`      ✅ COMPLETE: npm run tasks:complete ${task.id} <tokens-used>\n`);
    });
  }

  // PAUSED
  if (pausedTasks.length > 0) {
    console.log('⏸️  PAUSED TASKS (Resume these first)\n');

    pausedTasks.forEach(task => {
      console.log(`   📌 ${task.title}`);
      console.log(`      ID: ${task.id}`);
      if (task.checkpoint) {
        console.log(`      📍 Checkpoint: ${task.checkpoint.note}`);
      }
      console.log(`      ▶️  RESUME: npm run tasks:resume ${task.id}\n`);
    });
  }

  // PENDING WORK (Combined)
  const remaining = tasks.tokenBudget.remaining;
  const fittingPlans = pendingPlans.filter(p => !p.estimatedTokens || p.estimatedTokens <= remaining);
  const fittingTasks = pendingTasks.filter(t => t.estimatedTokens <= remaining);

  if (fittingPlans.length > 0 || fittingTasks.length > 0) {
    console.log(`⚪ READY TO START (Fits in ${remaining.toLocaleString()} tokens)\n`);

    // Sort by priority and tokens
    const priorityOrder = {high: 3, medium: 2, low: 1};

    // Show plans
    fittingPlans
      .sort((a, b) => {
        const priorityDiff = (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
        if (priorityDiff !== 0) return priorityDiff;
        return (a.estimatedTokens || 0) - (b.estimatedTokens || 0);
      })
      .slice(0, 3)
      .forEach((plan, idx) => {
        console.log(`   ${idx + 1}. 📋 ${plan.title}`);
        console.log(`         ID: ${plan.planId}`);
        console.log(`         Priority: ${plan.priority} | Tokens: ~${plan.estimatedTokens?.toLocaleString() || 'unknown'}`);
        console.log(`         ▶️  START: /build "ai-docs/plans/${plan.planId}/plan.md"\n`);
      });

    // Show tasks
    fittingTasks
      .sort((a, b) => {
        const priorityDiff = (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
        if (priorityDiff !== 0) return priorityDiff;
        return a.estimatedTokens - b.estimatedTokens;
      })
      .slice(0, 3)
      .forEach((task, idx) => {
        const offset = fittingPlans.length;
        console.log(`   ${idx + offset + 1}. 📌 ${task.title}`);
        console.log(`         ID: ${task.id}`);
        console.log(`         Priority: ${task.priority} | Tokens: ~${task.estimatedTokens.toLocaleString()}`);
        console.log(`         ▶️  START: npm run tasks:resume ${task.id}\n`);
      });
  } else if (remaining > 0) {
    console.log('⚪ NO WORK FITS REMAINING BUDGET\n');
    console.log(`   All pending items exceed ${remaining.toLocaleString()} tokens`);
    console.log('   Consider breaking down large tasks or resuming tomorrow\n');
  } else {
    console.log('⚪ TOKEN BUDGET EXHAUSTED\n');
    console.log('   Resume tomorrow or upgrade to higher tier\n');
  }

  // Summary stats
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 SUMMARY\n');
  console.log(`   Plans: ${inProgressPlans.length} in progress, ${pendingPlans.length} pending`);
  console.log(`   Tasks: ${inProgressTasks.length} in progress, ${pausedTasks.length} paused, ${pendingTasks.length} pending`);
  console.log(`   Completed: ${plans.plans.filter(p => p.status === 'completed').length} plans, ${tasks.tasks?.filter(t => t.state === 'completed').length || 0} tasks`);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Quick commands
  console.log('💡 QUICK COMMANDS\n');
  console.log('   npm run work        Show this unified dashboard');
  console.log('   npm run plans:list  List all plans with status');
  console.log('   npm run tasks:list  List all tasks with details');
  console.log('   npm run tasks       Show detailed task dashboard\n');
}

if (require.main === module) {
  showUnifiedDashboard().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}

module.exports = {showUnifiedDashboard};
