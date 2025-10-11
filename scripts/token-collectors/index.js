const ClaudeTokenCollector = require('./claude-collector');
const GeminiTokenCollector = require('./gemini-collector');
const CodexTokenCollector = require('./codex-collector');

/**
 * Factory for creating token collectors
 */
class TokenCollectorFactory {
  static create(model) {
    switch (model.toLowerCase()) {
      case 'claude':
      case 'claude-sonnet-4-5':
        return new ClaudeTokenCollector();

      case 'gemini':
      case 'gemini-2.5-pro':
      case 'gemini-2.5-flash':
        return new GeminiTokenCollector();

      case 'codex':
        return new CodexTokenCollector();

      default:
        throw new Error(`Unknown model: ${model}`);
    }
  }

  static async captureAll(workflowId) {
    const collectors = [
      new ClaudeTokenCollector(),
      new GeminiTokenCollector(),
      new CodexTokenCollector()
    ];

    const results = await Promise.allSettled(
      collectors.map(c => c.captureTokens(workflowId))
    );

    return results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);
  }
}

module.exports = TokenCollectorFactory;
