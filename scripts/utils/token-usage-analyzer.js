const fs = require('fs').promises;
const path = require('path');

const METRICS_FILE = path.join(__dirname, '../../ai-docs/logs/workflow-metrics.jsonl');

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function loadEntries(metricsFile = METRICS_FILE) {
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

function summarizeEntries(entries) {
  return entries.reduce(
    (acc, entry) => {
      const timestamp = toDate(entry.timestamp);
      if (timestamp && (!acc.lastTimestamp || timestamp > acc.lastTimestamp)) {
        acc.lastTimestamp = timestamp;
      }

      const tokens = entry.tokens || {};
      const total = Number(tokens.total) || 0;
      acc.totalTokens += total;
      acc.count += 1;

      if (tokens.byModel && typeof tokens.byModel === 'object') {
        Object.entries(tokens.byModel).forEach(([model, usage]) => {
          const modelTotal = Number(usage?.total ?? usage) || 0;
          acc.byModel[model] = (acc.byModel[model] || 0) + modelTotal;
        });
      }

      return acc;
    },
    { totalTokens: 0, count: 0, byModel: {}, lastTimestamp: null }
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
  const { metricsFile = METRICS_FILE, now = new Date() } = options;
  const entries = await loadEntries(metricsFile);
  if (entries.length === 0) {
    return {
      daily: { totalTokens: 0, count: 0, byModel: {}, lastTimestamp: null },
      weekly: { totalTokens: 0, count: 0, byModel: {}, lastTimestamp: null },
      total: { totalTokens: 0, count: 0, byModel: {}, lastTimestamp: null }
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
  startOfToday,
  startOfWeekWindow,
  METRICS_FILE
};
