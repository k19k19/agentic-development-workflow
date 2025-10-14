const calculator = require('./token-budget-calculator');

describe('token-budget-calculator', () => {
  describe('getRemainingBudget', () => {
    test.each([
      [167000, 0, 167000],
      [167000, 50000, 117000],
      [167000, 167000, 0],
      [167000, 200000, 0],
    ])('limit %d, used %d → %d', (limit, used, expected) => {
      expect(calculator.getRemainingBudget(limit, used)).toBe(expected);
    });
  });

  describe('getUsagePercent', () => {
    test.each([
      [0, 167000, 0],
      [83500, 167000, 50],
      [125250, 167000, 75],
      [150300, 167000, 90],
      [167000, 167000, 100],
    ])('used %d of %d → %d%', (used, limit, expected) => {
      expect(Math.round(calculator.getUsagePercent(used, limit))).toBe(expected);
    });
  });

  describe('getUsageWarningLevel', () => {
    test.each([
      [0, 'normal'],
      [50, 'normal'],
      [74, 'normal'],
      [75, 'warning'],
      [85, 'warning'],
      [89, 'warning'],
      [90, 'critical'],
      [95, 'critical'],
      [100, 'critical'],
    ])('usage %d%% → %s', (percent, expected) => {
      expect(calculator.getUsageWarningLevel(percent)).toBe(expected);
    });
  });

  describe('getTokensUsedToday', () => {
    const todayIso = new Date().toISOString();

    test('defaults to zero when no task data', () => {
      expect(calculator.getTokensUsedToday()).toBe(0);
    });

    test('resets when lastReset is before today', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(
        calculator.getTokensUsedToday({
          tokenBudget: { used: 5000, lastReset: yesterday.toISOString() }
        })
      ).toBe(0);
    });

    test('returns stored usage when lastReset is today', () => {
      expect(
        calculator.getTokensUsedToday({
          tokenBudget: { used: 12345, lastReset: todayIso }
        })
      ).toBe(12345);
    });

    test('supports manual override', () => {
      expect(
        calculator.getTokensUsedToday(
          { tokenBudget: { used: 0, lastReset: todayIso } },
          { manualUsage: 8000 }
        )
      ).toBe(8000);
    });
  });

  describe('getWeeklyTokenLimit', () => {
    test('falls back to daily limit * 7', () => {
      expect(calculator.getWeeklyTokenLimit({})).toBe(calculator.DEFAULT_CONFIG.dailyTokenLimit * 7);
    });

    test('uses explicit weekly override', () => {
      expect(calculator.getWeeklyTokenLimit({ weeklyTokenLimit: 900000 })).toBe(900000);
    });

    test('derives from custom daily limit when weekly unset', () => {
      expect(calculator.getWeeklyTokenLimit({ dailyTokenLimit: 200000 })).toBe(1400000);
    });
  });

  describe('getContextWindowLimit', () => {
    test('returns default when unset', () => {
      expect(calculator.getContextWindowLimit({})).toBe(calculator.DEFAULT_CONFIG.contextWindowLimit);
    });

    test('uses override when provided', () => {
      expect(calculator.getContextWindowLimit({ contextWindowLimit: 160000 })).toBe(160000);
    });
  });

  describe('getRecommendedTasks', () => {
    const tasks = [
      { id: 'TASK-1', title: 'Small task', estimatedTokens: 5000, priority: 'medium', status: 'pending' },
      { id: 'TASK-2', title: 'Medium task', estimatedTokens: 30000, priority: 'high', status: 'pending' },
      { id: 'TASK-3', title: 'Large task', estimatedTokens: 90000, priority: 'low', status: 'pending' },
      { id: 'TASK-4', title: 'Completed', estimatedTokens: 5000, priority: 'high', status: 'completed' },
    ];

    test('sorts by priority and size when all fit', () => {
      const result = calculator.getRecommendedTasks(tasks, 100000);
      expect(result.map(task => task.id)).toEqual(['TASK-2', 'TASK-1', 'TASK-3']);
    });

    test('filters out oversized tasks', () => {
      const result = calculator.getRecommendedTasks(tasks, 50000);
      expect(result.map(task => task.id)).toEqual(['TASK-2', 'TASK-1']);
    });

    test('returns empty list when none fit', () => {
      expect(calculator.getRecommendedTasks(tasks, 1000)).toEqual([]);
    });
  });

  describe('getSuggestedWorkflows', () => {
    test.each([
      [200000, 4],
      [100000, 3],
      [50000, 2],
      [10000, 1],
      [1000, 0],
    ])('remaining %d tokens yields %d suggestions', (remaining, expectedCount) => {
      expect(calculator.getSuggestedWorkflows(remaining)).toHaveLength(expectedCount);
    });
  });

  describe('formatTokens', () => {
    test.each([
      [1000, '1,000'],
      [50000, '50,000'],
      [167000, '167,000'],
      [1000000, '1,000,000'],
    ])('formats %d → %s', (input, expected) => {
      expect(calculator.formatTokens(input)).toBe(expected);
    });
  });

  describe('normalizeTokens', () => {
    test.each([
      [0, 0],
      [12345, 12345],
      [12345.9, 12345],
      ['5000', 5000],
      [null, 0],
      [undefined, 0],
      [-50, 0],
      ['not-a-number', 0]
    ])('normalizes %p → %d', (input, expected) => {
      expect(calculator.normalizeTokens(input)).toBe(expected);
    });
  });

  describe('calculateBudgetSummary', () => {
    test('supports manual usage override', () => {
      const summary = calculator.calculateBudgetSummary(null, { manualUsage: 40000 });
      expect(summary.used).toBe(40000);
      expect(summary.remaining).toBe(calculator.DEFAULT_CONFIG.dailyTokenLimit - 40000);
    });

    test('clamps negative manual usage to zero', () => {
      const summary = calculator.calculateBudgetSummary(null, { manualUsage: -100 });
      expect(summary.used).toBe(0);
      expect(summary.remaining).toBe(calculator.DEFAULT_CONFIG.dailyTokenLimit);
    });
  });
});
