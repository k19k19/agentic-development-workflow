const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const analyzer = require('./token-usage-analyzer');

async function withTempFile(lines, callback) {
  const filePath = path.join(os.tmpdir(), `token-usage-${Date.now()}-${Math.random()}.jsonl`);
  try {
    await fs.writeFile(filePath, lines.join('\n') + '\n', 'utf8');
    return await callback(filePath);
  } finally {
    await fs.unlink(filePath).catch(() => {});
  }
}

describe('token-usage-analyzer', () => {
  test('summarizes entries across daily and weekly windows', async () => {
    const now = new Date('2025-10-15T12:00:00Z');
    const lines = [
      JSON.stringify({
        timestamp: '2025-10-15T10:00:00Z',
        tokens: {
          total: 5000,
          byModel: {
            claude: { total: 3000 },
            gemini: { total: 2000 }
          }
        },
        note: 'Today discovery'
      }),
      JSON.stringify({
        timestamp: '2025-10-13T16:30:00Z',
        tokens: {
          byModel: {
            claude: { total: 4000 }
          }
        },
        note: 'Yesterday build'
      }),
      JSON.stringify({
        timestamp: '2025-10-08T09:00:00Z',
        tokens: {
          total: 1000,
          byModel: {
            codex: { total: 1000 }
          }
        },
        note: 'Last week'
      })
    ];

    const summary = await withTempFile(lines, async file =>
      analyzer.getUsageSummary({ metricsFile: file, now })
    );

    expect(summary.daily.totalTokens).toBe(5000);
    expect(summary.daily.byModel.claude).toBe(3000);
    expect(summary.weekly.totalTokens).toBe(9000);
    expect(summary.weekly.byModel.claude).toBe(7000);
    expect(summary.total.totalTokens).toBe(10000);
    expect(summary.total.byModel.codex).toBe(1000);
    expect(summary.total.count).toBe(3);
  });

  test('handles missing file gracefully', async () => {
    const result = await analyzer.getUsageSummary({
      metricsFile: path.join(os.tmpdir(), 'token-usage-nonexistent.jsonl'),
      now: new Date()
    });

    expect(result.total.totalTokens).toBe(0);
    expect(result.total.count).toBe(0);
  });
});
