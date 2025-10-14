/**
 * Token Budget Calculator
 *
 * Handles token budget tracking, warnings, and task recommendations
 */

/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
  dailyTokenLimit: 167000, // $20 Claude plan / 30 days * 5M tokens
  weeklyTokenLimit: 1169000, // Daily limit * 7 (rounded)
  warningThreshold: 0.75,   // 75% usage warning
  criticalThreshold: 0.90,   // 90% usage critical alert
  contextWindowLimit: 200000, // Claude Sonnet max window
  contextWarningThreshold: 0.8, // 80% of context window
  contextCriticalThreshold: 0.95 // 95% of context window
};

/**
 * Task size definitions (tokens)
 */
const TASK_SIZES = {
  small: 5000,
  medium: 30000,
  large: 80000,
  xlarge: 150000
};

/**
 * Get daily token limit from config
 *
 * @param {object} config - Configuration object
 * @returns {number} Daily token limit
 */
function getDailyTokenLimit(config = {}) {
  return config.dailyTokenLimit || DEFAULT_CONFIG.dailyTokenLimit;
}

/**
 * Get weekly token limit from config
 *
 * @param {object} config - Configuration object
 * @returns {number} Weekly token limit
 */
function getWeeklyTokenLimit(config = {}) {
  if (config.weeklyTokenLimit) {
    return config.weeklyTokenLimit;
  }

  const dailyLimit = getDailyTokenLimit(config);
  return dailyLimit * 7;
}

/**
 * Get context window limit (tokens)
 *
 * @param {object} config - Configuration object
 * @returns {number} Context window limit
 */
function getContextWindowLimit(config = {}) {
  return config.contextWindowLimit || DEFAULT_CONFIG.contextWindowLimit;
}

/**
 * Get tokens used today from task data
 *
 * @param {object} taskData - Task data from tasks.json
 * @returns {number} Tokens used today
 */
function getTokensUsedToday(taskData) {
  if (!taskData || !taskData.tokenBudget) {
    return 0;
  }

  const { used, lastReset } = taskData.tokenBudget;

  // Check if we need to reset (new day)
  const lastResetDate = new Date(lastReset);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (lastResetDate < today) {
    // Should have been reset, return 0
    return 0;
  }

  return used || 0;
}

/**
 * Calculate remaining token budget
 *
 * @param {number} limit - Daily token limit
 * @param {number} used - Tokens used today
 * @returns {number} Remaining tokens
 */
function getRemainingBudget(limit, used) {
  return Math.max(0, limit - used);
}

/**
 * Calculate usage percentage
 *
 * @param {number} used - Tokens used
 * @param {number} limit - Token limit
 * @returns {number} Usage percentage (0-100)
 */
function getUsagePercent(used, limit) {
  if (limit === 0) return 0;
  return (used / limit) * 100;
}

/**
 * Get usage warning level
 *
 * @param {number} usagePercent - Usage percentage
 * @param {object} config - Configuration with thresholds
 * @returns {string} 'normal' | 'warning' | 'critical'
 */
function getUsageWarningLevel(usagePercent, config = {}) {
  const criticalThreshold = (config.criticalThreshold || DEFAULT_CONFIG.criticalThreshold) * 100;
  const warningThreshold = (config.warningThreshold || DEFAULT_CONFIG.warningThreshold) * 100;

  if (usagePercent >= criticalThreshold) {
    return 'critical';
  }

  if (usagePercent >= warningThreshold) {
    return 'warning';
  }

  return 'normal';
}

/**
 * Filter tasks that fit within remaining budget
 *
 * @param {Array} tasks - Array of task objects
 * @param {number} remainingTokens - Remaining token budget
 * @returns {Array} Filtered and sorted tasks
 */
function getRecommendedTasks(tasks, remainingTokens) {
  return tasks
    .filter(task => {
      // Skip completed tasks
      if (task.status === 'completed') return false;

      // If task has estimated tokens, check if it fits
      if (task.estimatedTokens) {
        return task.estimatedTokens <= remainingTokens;
      }

      // If task has size property, check if it fits
      if (task.size && TASK_SIZES[task.size]) {
        return TASK_SIZES[task.size] <= remainingTokens;
      }

      // If no estimate, assume it fits (better to show than hide)
      return true;
    })
    .sort((a, b) => {
      // Sort by priority first (high > medium > low)
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityA = priorityOrder[a.priority] || 2;
      const priorityB = priorityOrder[b.priority] || 2;

      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }

      // Then by size (small first for quick wins)
      const sizeA = a.estimatedTokens || TASK_SIZES[a.size] || 0;
      const sizeB = b.estimatedTokens || TASK_SIZES[b.size] || 0;

      return sizeA - sizeB;
    });
}

/**
 * Get suggested workflow based on remaining budget
 *
 * @param {number} remainingTokens - Remaining token budget
 * @returns {Array} Suggested workflows
 */
function getSuggestedWorkflows(remainingTokens) {
  const suggestions = [];

  if (remainingTokens >= 150000) {
    suggestions.push({
      name: 'XLarge task',
      command: '/baw_dev_full_pipeline "[task]" "[docs]" "standard"',
      tokens: 150000,
      time: '2-4 hours'
    });
  }

  if (remainingTokens >= 90000) {
    suggestions.push({
      name: 'Large task',
      command: '/baw_dev_full_pipeline "[task]" "[docs]" "budget"',
      tokens: 90000,
      time: '1-2 hours'
    });
  }

  if (remainingTokens >= 30000) {
    suggestions.push({
      name: 'Medium task',
      command: '/baw_dev_discovery_build "[task]"',
      tokens: 30000,
      time: '30-60 min'
    });
  }

  if (remainingTokens >= 5000) {
    suggestions.push({
      name: 'Small task',
      command: '/baw_dev_quick_build "[task]"',
      tokens: 5000,
      time: '5-15 min'
    });
  }

  return suggestions;
}

/**
 * Generate progress bar string
 *
 * @param {number} percent - Percentage (0-100)
 * @param {number} width - Bar width in characters
 * @returns {string} Progress bar
 */
function generateProgressBar(percent, width = 30) {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;

  return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
}

/**
 * Format token count with thousands separator
 *
 * @param {number} tokens - Token count
 * @returns {string} Formatted string
 */
function formatTokens(tokens) {
  return tokens.toLocaleString('en-US');
}

/**
 * Calculate complete budget summary
 *
 * @param {object} taskData - Task data from tasks.json
 * @param {object} config - Configuration
 * @returns {object} Budget summary
 */
function calculateBudgetSummary(taskData, config = {}) {
  const limit = getDailyTokenLimit(config);
  const used = getTokensUsedToday(taskData);
  const remaining = getRemainingBudget(limit, used);
  const usagePercent = getUsagePercent(used, limit);
  const warningLevel = getUsageWarningLevel(usagePercent, config);
  const progressBar = generateProgressBar(usagePercent);
  const suggestedWorkflows = getSuggestedWorkflows(remaining);

  return {
    limit,
    used,
    remaining,
    usagePercent: Math.round(usagePercent * 10) / 10,
    warningLevel,
    progressBar,
    suggestedWorkflows,
    formatted: {
      limit: formatTokens(limit),
      used: formatTokens(used),
      remaining: formatTokens(remaining)
    }
  };
}

module.exports = {
  getDailyTokenLimit,
  getWeeklyTokenLimit,
  getContextWindowLimit,
  getTokensUsedToday,
  getRemainingBudget,
  getUsagePercent,
  getUsageWarningLevel,
  getRecommendedTasks,
  getSuggestedWorkflows,
  generateProgressBar,
  formatTokens,
  calculateBudgetSummary,
  TASK_SIZES,
  DEFAULT_CONFIG
};
