#!/usr/bin/env node

/**
 * Task Management System
 *
 * Tracks pending tasks, token budget, and context window usage
 * Helps maximize productivity under $20 budget plan constraints
 */

const fs = require('fs').promises;
const path = require('path');

const TASKS_FILE = path.join(__dirname, '..', 'ai-docs', 'tasks', 'tasks.json');
const SESSION_DIR = path.join(__dirname, '..', 'ai-docs', 'sessions');

// Task states
const STATES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  PAUSED: 'paused',
  BLOCKED: 'blocked',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Task sizes and estimated tokens
const TASK_SIZES = {
  SMALL: { label: 'Small', tokens: 5000, time: '5-15 min' },
  MEDIUM: { label: 'Medium', tokens: 30000, time: '30-60 min' },
  LARGE: { label: 'Large', tokens: 80000, time: '1-2 hours' },
  XLARGE: { label: 'X-Large', tokens: 150000, time: '2-4 hours' }
};

async function loadTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        tasks: [],
        completedTasks: [],
        tokenBudget: {
          dailyLimit: 500000,
          used: 0,
          remaining: 500000,
          lastReset: new Date().toISOString().split('T')[0] + 'T00:00:00Z'
        },
        contextWindow: {
          limit: 200000,
          currentUsage: 0,
          warningThreshold: 150000,
          criticalThreshold: 180000
        }
      };
    }
    throw error;
  }
}

async function saveTasks(data) {
  data.lastUpdated = new Date().toISOString();
  await fs.writeFile(TASKS_FILE, JSON.stringify(data, null, 2));
}

async function addTask(title, description, size, priority = 'medium') {
  const data = await loadTasks();

  const task = {
    id: `TASK-${Date.now()}`,
    title,
    description,
    size,
    priority,
    state: STATES.PENDING,
    estimatedTokens: TASK_SIZES[size.toUpperCase()]?.tokens || 30000,
    estimatedTime: TASK_SIZES[size.toUpperCase()]?.time || '30-60 min',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    checkpoint: null,
    dependencies: [],
    tags: []
  };

  data.tasks.push(task);
  await saveTasks(data);

  console.log(`✅ Task added: ${task.id}`);
  console.log(`   ${task.title}`);
  console.log(`   Size: ${task.size} (~${task.estimatedTokens.toLocaleString()} tokens)`);
  console.log(`   Priority: ${task.priority}`);

  return task;
}

async function pauseTask(taskId, checkpoint) {
  const data = await loadTasks();
  const task = data.tasks.find(t => t.id === taskId);

  if (!task) {
    console.error(`❌ Task not found: ${taskId}`);
    return;
  }

  task.state = STATES.PAUSED;
  task.checkpoint = {
    timestamp: new Date().toISOString(),
    note: checkpoint,
    resumeInstructions: checkpoint
  };
  task.updatedAt = new Date().toISOString();

  await saveTasks(data);

  console.log(`⏸️  Task paused: ${task.id}`);
  console.log(`   ${task.title}`);
  console.log(`   Checkpoint: ${checkpoint}`);

  return task;
}

async function resumeTask(taskId) {
  const data = await loadTasks();
  const task = data.tasks.find(t => t.id === taskId);

  if (!task) {
    console.error(`❌ Task not found: ${taskId}`);
    return;
  }

  task.state = STATES.IN_PROGRESS;
  task.updatedAt = new Date().toISOString();

  await saveTasks(data);

  console.log(`▶️  Task resumed: ${task.id}`);
  console.log(`   ${task.title}`);
  if (task.checkpoint) {
    console.log(`   Last checkpoint: ${task.checkpoint.note}`);
  }

  return task;
}

async function completeTask(taskId, tokensUsed) {
  const data = await loadTasks();
  const taskIndex = data.tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    console.error(`❌ Task not found: ${taskId}`);
    return;
  }

  const task = data.tasks[taskIndex];
  task.state = STATES.COMPLETED;
  task.completedAt = new Date().toISOString();
  task.actualTokens = tokensUsed;
  task.updatedAt = new Date().toISOString();

  // Move to completed tasks
  data.completedTasks.push(task);
  data.tasks.splice(taskIndex, 1);

  // Update token budget
  data.tokenBudget.used += tokensUsed;
  data.tokenBudget.remaining = data.tokenBudget.dailyLimit - data.tokenBudget.used;

  await saveTasks(data);

  console.log(`✅ Task completed: ${task.id}`);
  console.log(`   ${task.title}`);
  console.log(`   Tokens used: ${tokensUsed.toLocaleString()}`);
  console.log(`   Remaining budget: ${data.tokenBudget.remaining.toLocaleString()}`);

  return task;
}

async function listTasks(filter = 'active') {
  const data = await loadTasks();

  let tasksToShow;
  let title;

  if (filter === 'completed') {
    tasksToShow = data.completedTasks;
    title = '📋 Completed Tasks';
  } else if (filter === 'all') {
    tasksToShow = [...data.tasks, ...data.completedTasks];
    title = '📋 All Tasks';
  } else {
    tasksToShow = data.tasks.filter(t =>
      t.state !== STATES.COMPLETED && t.state !== STATES.CANCELLED
    );
    title = '📋 Active Tasks';
  }

  console.log(`\n${title}\n`);

  if (tasksToShow.length === 0) {
    console.log('No tasks found.\n');
    return;
  }

  // Group by state
  const grouped = {};
  tasksToShow.forEach(task => {
    const state = task.state || STATES.PENDING;
    if (!grouped[state]) grouped[state] = [];
    grouped[state].push(task);
  });

  // Display by priority: in_progress, paused, blocked, pending, completed
  const stateOrder = [
    STATES.IN_PROGRESS,
    STATES.PAUSED,
    STATES.BLOCKED,
    STATES.PENDING,
    STATES.COMPLETED
  ];

  stateOrder.forEach(state => {
    if (!grouped[state] || grouped[state].length === 0) return;

    const stateEmoji = {
      [STATES.IN_PROGRESS]: '🟢',
      [STATES.PAUSED]: '⏸️ ',
      [STATES.BLOCKED]: '🔴',
      [STATES.PENDING]: '⚪',
      [STATES.COMPLETED]: '✅'
    };

    console.log(`${stateEmoji[state]} ${state.toUpperCase()}`);

    grouped[state].forEach(task => {
      console.log(`  ${task.id}: ${task.title}`);
      console.log(`    Size: ${task.size} (~${task.estimatedTokens.toLocaleString()} tokens)`);
      console.log(`    Priority: ${task.priority}`);
      if (task.checkpoint) {
        console.log(`    📍 Checkpoint: ${task.checkpoint.note}`);
      }
      if (task.actualTokens) {
        console.log(`    ✓ Used: ${task.actualTokens.toLocaleString()} tokens`);
      }
      console.log('');
    });
  });
}

async function showStatus() {
  const data = await loadTasks();

  // Check if token budget needs reset (new day)
  const today = new Date().toISOString().split('T')[0];
  const lastReset = data.tokenBudget.lastReset.split('T')[0];

  if (today !== lastReset) {
    data.tokenBudget.used = 0;
    data.tokenBudget.remaining = data.tokenBudget.dailyLimit;
    data.tokenBudget.lastReset = today + 'T00:00:00Z';
    await saveTasks(data);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 PRODUCTIVITY DASHBOARD');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Token Budget
  const budgetPercent = ((data.tokenBudget.used / data.tokenBudget.dailyLimit) * 100).toFixed(1);
  const budgetBar = createProgressBar(data.tokenBudget.used, data.tokenBudget.dailyLimit, 30);

  console.log('💰 TOKEN BUDGET (Daily)');
  console.log(`   Used: ${data.tokenBudget.used.toLocaleString()} / ${data.tokenBudget.dailyLimit.toLocaleString()} (${budgetPercent}%)`);
  console.log(`   ${budgetBar}`);
  console.log(`   Remaining: ${data.tokenBudget.remaining.toLocaleString()} tokens\n`);

  // Context Window
  const contextPercent = ((data.contextWindow.currentUsage / data.contextWindow.limit) * 100).toFixed(1);
  const contextBar = createProgressBar(data.contextWindow.currentUsage, data.contextWindow.limit, 30);
  let contextWarning = '';

  if (data.contextWindow.currentUsage >= data.contextWindow.criticalThreshold) {
    contextWarning = ' ⚠️  CRITICAL - Start new session!';
  } else if (data.contextWindow.currentUsage >= data.contextWindow.warningThreshold) {
    contextWarning = ' ⚠️  WARNING - Consider new session';
  }

  console.log('🪟 CONTEXT WINDOW (Current Session)');
  console.log(`   Used: ${data.contextWindow.currentUsage.toLocaleString()} / ${data.contextWindow.limit.toLocaleString()} (${contextPercent}%)${contextWarning}`);
  console.log(`   ${contextBar}\n`);

  // Task Summary
  const activeTasks = data.tasks.filter(t =>
    t.state !== STATES.COMPLETED && t.state !== STATES.CANCELLED
  );
  const inProgress = activeTasks.filter(t => t.state === STATES.IN_PROGRESS);
  const paused = activeTasks.filter(t => t.state === STATES.PAUSED);
  const blocked = activeTasks.filter(t => t.state === STATES.BLOCKED);
  const pending = activeTasks.filter(t => t.state === STATES.PENDING);

  console.log('📋 TASK SUMMARY');
  console.log(`   🟢 In Progress: ${inProgress.length}`);
  console.log(`   ⏸️  Paused: ${paused.length}`);
  console.log(`   🔴 Blocked: ${blocked.length}`);
  console.log(`   ⚪ Pending: ${pending.length}`);
  console.log(`   ✅ Completed Today: ${data.completedTasks.filter(t => {
    const completedDate = t.completedAt?.split('T')[0];
    return completedDate === today;
  }).length}\n`);

  // Recommendations
  console.log('💡 RECOMMENDATIONS\n');

  // Paused tasks reminder
  if (paused.length > 0) {
    console.log('⏸️  You have paused tasks:');
    paused.forEach(task => {
      console.log(`   • ${task.id}: ${task.title}`);
      if (task.checkpoint) {
        console.log(`     Last checkpoint: ${task.checkpoint.note}`);
      }
    });
    console.log('');
  }

  // Token budget recommendations
  const remaining = data.tokenBudget.remaining;
  const fittingTasks = pending.filter(t => t.estimatedTokens <= remaining);

  if (remaining > 0 && fittingTasks.length > 0) {
    console.log(`✨ Tasks that fit in remaining budget (${remaining.toLocaleString()} tokens):`);

    // Sort by size (smallest first for quick wins)
    fittingTasks.sort((a, b) => a.estimatedTokens - b.estimatedTokens);

    fittingTasks.slice(0, 5).forEach(task => {
      console.log(`   • ${task.id}: ${task.title}`);
      console.log(`     Size: ${task.size} (~${task.estimatedTokens.toLocaleString()} tokens, ${task.estimatedTime})`);
    });
    console.log('');
  } else if (remaining <= 0) {
    console.log('⚠️  Daily token budget exhausted. Resume tomorrow or upgrade plan.\n');
  }

  // Context window warning
  if (data.contextWindow.currentUsage >= data.contextWindow.criticalThreshold) {
    console.log('🚨 CRITICAL: Context window at ' + contextPercent + '%');
    console.log('   Action: Start a new session to avoid errors');
    console.log('   Run: exit (then restart claude-code)\n');
  } else if (data.contextWindow.currentUsage >= data.contextWindow.warningThreshold) {
    console.log('⚠️  WARNING: Context window at ' + contextPercent + '%');
    console.log('   Consider starting a new session after current task\n');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

function createProgressBar(current, total, width = 30) {
  const percent = Math.min(current / total, 1);
  const filled = Math.floor(percent * width);
  const empty = width - filled;

  let bar = '[';
  let color = '';

  if (percent < 0.5) {
    color = ''; // Green (default)
  } else if (percent < 0.75) {
    color = ''; // Yellow (use default)
  } else {
    color = ''; // Red (use default)
  }

  bar += '█'.repeat(filled);
  bar += '░'.repeat(empty);
  bar += ']';

  return bar;
}

async function updateContextWindow(tokensUsed) {
  const data = await loadTasks();
  data.contextWindow.currentUsage = tokensUsed;
  await saveTasks(data);
}

// CLI Interface
const command = process.argv[2];
const args = process.argv.slice(3);

(async () => {
  try {
    switch (command) {
      case 'add':
        await addTask(args[0], args[1] || '', args[2] || 'medium', args[3] || 'medium');
        break;

      case 'pause':
        await pauseTask(args[0], args[1] || 'Paused for later');
        break;

      case 'resume':
        await resumeTask(args[0]);
        break;

      case 'complete':
        await completeTask(args[0], parseInt(args[1]) || 0);
        break;

      case 'list':
        await listTasks(args[0] || 'active');
        break;

      case 'status':
        await showStatus();
        break;

      case 'context':
        await updateContextWindow(parseInt(args[0]) || 0);
        console.log(`✅ Context window updated: ${args[0]} tokens`);
        break;

      default:
        console.log(`
Task Management System

Usage:
  node scripts/manage-tasks.js <command> [arguments]

Commands:
  add <title> [description] [size] [priority]
    Add a new task
    Sizes: small, medium, large, xlarge
    Priorities: low, medium, high, critical

  pause <task-id> [checkpoint]
    Pause a task with optional checkpoint note

  resume <task-id>
    Resume a paused task

  complete <task-id> <tokens-used>
    Mark task as complete and update token budget

  list [filter]
    List tasks (filter: active, completed, all)

  status
    Show productivity dashboard with recommendations

  context <tokens-used>
    Update current context window usage

Examples:
  node scripts/manage-tasks.js add "Implement OAuth" "Add OAuth2 authentication" large high
  node scripts/manage-tasks.js pause TASK-123 "Completed plan phase, ready to build"
  node scripts/manage-tasks.js resume TASK-123
  node scripts/manage-tasks.js complete TASK-123 85000
  node scripts/manage-tasks.js status
`);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
