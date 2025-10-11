#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const tokenCalculator = require('./utils/token-budget-calculator');
const tokenUsageAnalyzer = require('./utils/token-usage-analyzer');

const REPO_ROOT = path.join(__dirname, '..');
const WORKFLOW_DIR = path.join(REPO_ROOT, 'ai-docs/workflow');
const STATUS_INDEX_FILE = path.join(WORKFLOW_DIR, 'status-index.json');
const TASKS_FILE = path.join(WORKFLOW_DIR, 'tasks.json');
const CROSS_SESSION_PROMPT_FILE = path.join(WORKFLOW_DIR, 'cross-session-prompt.md');

const { TASK_SIZES, DEFAULT_CONFIG, generateProgressBar, formatTokens, getRemainingBudget, getUsagePercent, getUsageWarningLevel, getDailyTokenLimit, getWeeklyTokenLimit, getContextWindowLimit, getSuggestedWorkflows, getRecommendedTasks } = tokenCalculator;

const CHEAP_MODELS = ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'codex', 'gpt-4o-mini'];

function readJson(filePath) {
  return fs.readFile(filePath, 'utf8').then(JSON.parse);
}

async function loadStatusIndex() {
  try {
    return await readJson(STATUS_INDEX_FILE);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { features: [] };
    }
    throw error;
  }
}

async function loadTasks() {
  try {
    const data = await readJson(TASKS_FILE);
    return Array.isArray(data.tasks) ? data.tasks : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function loadCrossSessionPrompt() {
  try {
    const content = await fs.readFile(CROSS_SESSION_PROMPT_FILE, 'utf8');
    return content.trim();
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

function estimateTokensFromText(text) {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words * 1.3);
}

function formatWarning(level) {
  if (level === 'critical') return '🔴';
  if (level === 'warning') return '🟠';
  return '🟢';
}

function deriveTasksFromFeatures(features = []) {
  return features
    .filter(feature => feature?.nextCommand)
    .map(feature => {
      const command = feature.nextCommand.trim();
      const firstToken = command.split(/\s+/)[0];
      let size = 'medium';
      let estimatedTokens = TASK_SIZES.medium;

      if (firstToken === '/quick') {
        size = 'small';
        estimatedTokens = TASK_SIZES.small;
      } else if (firstToken === '/scout_build') {
        size = 'medium';
        estimatedTokens = TASK_SIZES.medium;
      } else if (firstToken === '/full') {
        size = 'large';
        estimatedTokens = TASK_SIZES.large;
      } else if (firstToken === '/build' || firstToken === '/build_w_report') {
        size = 'large';
        estimatedTokens = TASK_SIZES.large;
      }

      return {
        id: feature.featureId || feature.title,
        title: feature.title || feature.featureId,
        command,
        priority: feature.status === 'blocked' ? 'medium' : 'high',
        status: feature.status || 'pending',
        size,
        estimatedTokens
      };
    });
}

function getCheapModelShare(byModel = {}, totalTokens = 0) {
  if (!totalTokens) return 0;
  const cheapTokens = Object.entries(byModel).reduce((sum, [model, tokens]) => {
    if (CHEAP_MODELS.includes(model)) {
      return sum + tokens;
    }
    return sum;
  }, 0);
  return (cheapTokens / totalTokens) * 100;
}

function printSection(title) {
  console.log(`\n${title}`);
  console.log('----------------------------------------');
}

function printRecommendedTasks(recommended, remainingTokens) {
  if (!recommended.length) {
    const suggestions = getSuggestedWorkflows(remainingTokens);
    if (suggestions.length === 0) {
      console.log('No tracked tasks fit today\'s remaining budget. Consider documenting follow-up work or archiving completed features.');
      return;
    }

    console.log('No tracked tasks fit today\'s remaining budget. Based on remaining tokens you can still run:');
    suggestions.forEach(item => {
      console.log(`  • ${item.name} — ${item.command} (${formatTokens(item.tokens)} tokens)`);
    });
    console.log('Use Gemini MCP for research/doc reviews and Codex MCP for implementation to conserve Claude usage.');
    return;
  }

  recommended.slice(0, 3).forEach(task => {
    const estimate = formatTokens(task.estimatedTokens || TASK_SIZES[task.size] || 0);
    const command = task.command || `/${task.size === 'small' ? 'quick' : task.size === 'medium' ? 'scout_build' : 'full'} "${task.title}"`;
    console.log(`  • ${task.title} (${task.id})`);
    console.log(`    Command: ${command}`);
    console.log(`    Estimated tokens: ${estimate}`);
  });

  if (recommended.length > 3) {
    console.log(`  …and ${recommended.length - 3} more tasks fit within today\'s remaining budget.`);
  }

  console.log('Route simple doc summaries to Gemini MCP and UI/code tweaks to Codex MCP to keep Claude tokens available for complex debugging.');
}

(async () => {
  try {
    const now = new Date();
    const usageSummary = await tokenUsageAnalyzer.getUsageSummary({ now });
    const dailyLimit = getDailyTokenLimit(DEFAULT_CONFIG);
    const weeklyLimit = getWeeklyTokenLimit(DEFAULT_CONFIG);

    const dailyUsed = usageSummary.daily.totalTokens;
    const weeklyUsed = usageSummary.weekly.totalTokens;

    const dailyRemaining = getRemainingBudget(dailyLimit, dailyUsed);
    const weeklyRemaining = getRemainingBudget(weeklyLimit, weeklyUsed);

    const dailyPercent = getUsagePercent(dailyUsed, dailyLimit);
    const weeklyPercent = getUsagePercent(weeklyUsed, weeklyLimit);

    const dailyWarning = getUsageWarningLevel(dailyPercent, DEFAULT_CONFIG);
    const weeklyWarning = getUsageWarningLevel(weeklyPercent, DEFAULT_CONFIG);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Session Kickoff Dashboard');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    printSection('Daily Token Budget (Claude $20 plan)');
    console.log(`Limit:      ${formatTokens(dailyLimit)} tokens`);
    console.log(`Used today: ${formatTokens(dailyUsed)} tokens`);
    console.log(`Remaining:  ${formatTokens(dailyRemaining)} tokens`);
    console.log(`${formatWarning(dailyWarning)} Usage: ${dailyPercent.toFixed(1)}% ${generateProgressBar(dailyPercent)}`);

    const suggestedWorkflows = getSuggestedWorkflows(dailyRemaining);
    if (suggestedWorkflows.length > 0) {
      console.log('Suggested workflows that fit the remaining budget today:');
      suggestedWorkflows.forEach(item => {
        console.log(`  • ${item.name} — ${item.command} (${formatTokens(item.tokens)} tokens, ${item.time})`);
      });
    }

    printSection('Weekly Token Budget (rolling 7 days)');
    console.log(`Limit:      ${formatTokens(weeklyLimit)} tokens`);
    console.log(`Used:       ${formatTokens(weeklyUsed)} tokens`);
    console.log(`Remaining:  ${formatTokens(weeklyRemaining)} tokens`);
    console.log(`${formatWarning(weeklyWarning)} Usage: ${weeklyPercent.toFixed(1)}% ${generateProgressBar(weeklyPercent)}`);

    const cheapShare = getCheapModelShare(usageSummary.weekly.byModel, weeklyUsed);
    if (weeklyUsed > 0) {
      console.log(`Model mix (last 7 days): ${cheapShare.toFixed(1)}% from Gemini/Codex tiers.`);
      if (cheapShare < 60) {
        console.log('Tip: Shift simple discovery and boilerplate to Gemini MCP and Codex MCP to keep Claude within the $20 plan.');
      } else {
        console.log('Great balance! Continue leaning on Gemini/Codex for straightforward tasks to maximize Claude availability.');
      }
    } else {
      console.log('No token usage recorded yet. Default to Gemini MCP for document reads and Codex MCP for quick fixes.');
    }

    const crossSessionPrompt = await loadCrossSessionPrompt();
    const contextLimit = getContextWindowLimit(DEFAULT_CONFIG);
    const contextWarningThreshold = DEFAULT_CONFIG.contextWarningThreshold || 0.8;
    const contextCriticalThreshold = DEFAULT_CONFIG.contextCriticalThreshold || 0.95;

    printSection('Cross-Session Prompt Health');
    if (!crossSessionPrompt) {
      console.log(`No cross-session prompt found. Create ${path.relative(process.cwd(), CROSS_SESSION_PROMPT_FILE)} to persist session memory.`);
    } else {
      const estimatedTokens = estimateTokensFromText(crossSessionPrompt);
      const contextPercent = (estimatedTokens / contextLimit) * 100;
      const progress = generateProgressBar(contextPercent);
      let indicator = '🟢';
      if (contextPercent >= contextCriticalThreshold * 100) {
        indicator = '🔴';
        console.log('⚠️  Context window nearly full. Trim older notes or move them into app-docs/specs before the session overflows.');
      } else if (contextPercent >= contextWarningThreshold * 100) {
        indicator = '🟠';
        console.log('⚠️  Cross-session prompt is past 80% of the context window. Archive stale details to avoid truncation.');
      }
      console.log(`${indicator} Estimated size: ${estimatedTokens.toLocaleString()} tokens (${contextPercent.toFixed(1)}%) ${progress}`);
      console.log('Snapshot (first 240 chars):');
      console.log(`  "${crossSessionPrompt.slice(0, 240)}${crossSessionPrompt.length > 240 ? '…' : ''}"`);
    }

    const statusIndex = await loadStatusIndex();
    const features = Array.isArray(statusIndex.features) ? statusIndex.features : [];
    printSection('Cross-Session Workflow');
    if (features.length === 0) {
      console.log('No workflow entries recorded. Run a slash command (e.g., /scout) and sync with `npm run workflow:sync`.');
    } else {
      console.log(`Tracked features: ${features.length}`);
      features.slice(0, 3).forEach(feature => {
        console.log(`  • ${feature.title} (${feature.featureId})`);
        console.log(`    Phase: ${feature.currentPhase} • Status: ${feature.status}`);
        if (feature.nextCommand) {
          console.log(`    Next: ${feature.nextCommand}`);
        }
        if (feature.summary) {
          console.log(`    Summary: ${feature.summary}`);
        }
      });
      if (features.length > 3) {
        console.log(`  …and ${features.length - 3} more features in flight.`);
      }
    }

    const tasks = await loadTasks();
    const derivedTasks = deriveTasksFromFeatures(features);
    const allTasks = [...tasks, ...derivedTasks];
    const uniqueTasks = [];
    const seen = new Set();
    allTasks.forEach(task => {
      if (!task || !task.id) return;
      if (seen.has(task.id)) return;
      seen.add(task.id);
      uniqueTasks.push(task);
    });

    const recommended = getRecommendedTasks(uniqueTasks, dailyRemaining);

    printSection('Tasks that fit today\'s budget');
    printRecommendedTasks(recommended, dailyRemaining);

    printSection('Next Steps');
    console.log('1. Run `npm run workflow:sync` after each command to keep the dashboard current.');
    console.log('2. Default to Gemini MCP for doc summarization/research and Codex MCP for UI or syntax fixes.');
    console.log('3. Reserve Claude for architecture, multi-file reasoning, and verification.');
    console.log('4. Update app-docs/specs when features complete and trim the cross-session prompt regularly.');

    console.log('\nStay focused and budget-friendly!');
  } catch (error) {
    console.error('❌ Failed to render session dashboard');
    console.error(error);
    process.exit(1);
  }
})();
