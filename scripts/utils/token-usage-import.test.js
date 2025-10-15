const fs = require('fs').promises;
const os = require('os');
const path = require('path');
const {
  parseTokenUsage,
  detectModel,
  detectSessionId,
  runImport
} = require('./token-usage-import');

function createTempDir(prefix = 'token-import-test-') {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

describe('token-usage-import', () => {
  test('parseTokenUsage extracts totals and models', () => {
    const text = `Session summary\nToken usage:\n- Claude (Sonnet 4.5): 12,345 tokens\n- Gemini 2.5 Flash: 2,000 tokens\nTotal tokens: 14,345`;
    const usage = parseTokenUsage(text);
    expect(usage.total).toBe(14345);
    expect(usage.byModel).toEqual({ claude: 12345, gemini: 2000 });
  });

  test('parseTokenUsage handles input/output breakdown', () => {
    const text = `Token usage:\nClaude input tokens: 8,500\nClaude output tokens: 1,200\nTotal tokens: 9,700`;
    const usage = parseTokenUsage(text);
    expect(usage.total).toBe(9700);
    expect(usage.byModel).toEqual({ claude: 9700 });
  });

  test('detectModel handles various aliases', () => {
    expect(detectModel('Claude Sonnet')).toBe('claude');
    expect(detectModel('Gemini Flash tokens')).toBe('gemini');
    expect(detectModel('OpenAI GPT-4o usage')).toBe('openai');
    expect(detectModel('Codex')).toBe('codex');
    expect(detectModel('Total tokens')).toBe('total');
    expect(detectModel('Unknown model')).toBeNull();
  });

  test('detectSessionId derives id from file path', () => {
    expect(detectSessionId('ai-docs/workflow/features/demo/sessions/SESSION-2025-01-01.md')).toBe(
      'SESSION-2025-01-01.md'
    );
    expect(detectSessionId('ai-docs/workflow/features/demo/log.md')).toBeUndefined();
  });

  test('runImport appends entries for files with token usage', async () => {
    const tmpDir = await createTempDir();
    const logPath = path.join(tmpDir, 'token-usage.jsonl');
    const sessionDir = path.join(tmpDir, 'feature', 'sessions');
    await fs.mkdir(sessionDir, { recursive: true });
    const sessionFile = path.join(sessionDir, 'SESSION-2025-01-01-summary.md');
    await fs.writeFile(
      sessionFile,
      'Token usage:\n- Claude: 5,000 tokens\n- Gemini: 1,000 tokens\nTotal tokens: 6,000\n'
    );

    const { entries, processed, skipped } = await runImport({
      targetPath: tmpDir,
      logPath,
      source: 'test',
      dryRun: false
    });

    expect(entries).toHaveLength(1);
    expect(processed).toHaveLength(1);
    expect(skipped).toHaveLength(0);

    const logContent = await fs.readFile(logPath, 'utf8');
    const lines = logContent.trim().split('\n');
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0]);
    expect(parsed.tokens.total).toBe(6000);
    expect(parsed.tokens.byModel).toEqual({ claude: { total: 5000 }, gemini: { total: 1000 } });
    expect(parsed.source).toBe('test');
    expect(parsed.sourceFile).toContain('feature/sessions/SESSION-2025-01-01-summary.md');
  });
});
