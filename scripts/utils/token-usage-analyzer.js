const fs = require('fs').promises;
const path = require('path');
const { normalizeTokens } = require('./token-budget-calculator');

const TOKEN_USAGE_FILE = path.join(__dirname, '../../ai-docs/workflow/token-usage.jsonl');

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function loadEntries(metricsFile = TOKEN_USAGE_FILE) {
  try {
    const raw = await fs.readFile(metricsFile, 'utf8');
    return raw
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (error) {
          return { __parseError: error.message, __raw: line };
        }
      })
      .filter(entry => !entry.__parseError);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

function normalizeEntry(entry) {
  const timestamp = toDate(entry.timestamp);
  if (!timestamp) return null;

  const tokens = entry.tokens || {};
  const summary = {
    timestamp,
    total: normalizeTokens(tokens.total),
    byModel: {}
  };

  const byModelSource = tokens.byModel || entry.byModel;
  if (byModelSource && typeof byModelSource === 'object') {
    Object.entries(byModelSource).forEach(([model, usage]) => {
      const normalized = normalizeTokens(usage?.total ?? usage);
      if (normalized > 0) {
        summary.byModel[model] = (summary.byModel[model] || 0) + normalized;
      }
    });
  }

  if (summary.total === 0) {
    summary.total = Object.values(summary.byModel).reduce((sum, value) => sum + value, 0);
  }

  return summary;
}

function summarizeEntries(entries) {
  return entries.reduce(
    (acc, entry) => {
      const normalized = normalizeEntry(entry);
      if (!normalized) {
        return acc;
      }

      const { timestamp, total, byModel } = normalized;

      if (timestamp && (!acc.lastTimestamp || timestamp > acc.lastTimestamp)) {
        acc.lastTimestamp = timestamp;
      }

      acc.totalTokens += total;
      acc.count += 1;

      Object.entries(byModel).forEach(([model, value]) => {
        acc.byModel[model] = (acc.byModel[model] || 0) + value;
      });

      if (total === 0) {
        acc.zeroCount = (acc.zeroCount || 0) + 1;
      }

      return acc;
    },
    { totalTokens: 0, count: 0, byModel: {}, lastTimestamp: null, zeroCount: 0 }
  );
}

function filterEntries(entries, predicate) {
  return entries.filter(entry => {
    const timestamp = toDate(entry.timestamp);
    if (!timestamp) return false;
    return predicate(timestamp);
  });
}

function startOfToday(now) {
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfWeekWindow(now) {
  const date = startOfToday(now);
  date.setDate(date.getDate() - 6);
  return date;
}

async function getUsageSummary(options = {}) {
  const { metricsFile = TOKEN_USAGE_FILE, now = new Date() } = options;
  const entries = await loadEntries(metricsFile);
  if (entries.length === 0) {
    return {
      daily: { totalTokens: 0, count: 0, byModel: {}, lastTimestamp: null, zeroCount: 0 },
      weekly: { totalTokens: 0, count: 0, byModel: {}, lastTimestamp: null, zeroCount: 0 },
      total: { totalTokens: 0, count: 0, byModel: {}, lastTimestamp: null, zeroCount: 0 }
    };
  }

  const todayStart = startOfToday(now);
  const weekStart = startOfWeekWindow(now);

  const dailyEntries = filterEntries(entries, timestamp => timestamp >= todayStart);
  const weeklyEntries = filterEntries(entries, timestamp => timestamp >= weekStart);

  const totalSummary = summarizeEntries(entries);
  const dailySummary = summarizeEntries(dailyEntries);
  const weeklySummary = summarizeEntries(weeklyEntries);

  return {
    daily: dailySummary,
    weekly: weeklySummary,
    total: totalSummary
  };
}

module.exports = {
  getUsageSummary,
  loadEntries,
  summarizeEntries,
  normalizeEntry,
  startOfToday,
  startOfWeekWindow,
  TOKEN_USAGE_FILE
};
