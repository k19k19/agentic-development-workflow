const BaseTokenCollector = require('./base-collector');

class CodexTokenCollector extends BaseTokenCollector {
  constructor() {
    super();
    // Codex MCP doesn't expose token counts directly
    // Use estimation based on input/output size
  }

  async captureTokens(conversationId) {
    try {
      // Estimate based on character count
      // Average: 1 token ≈ 4 characters for code
      const usage = await this._estimateFromConversation(conversationId);

      return {
        model: 'codex',
        inputTokens: usage.input,
        outputTokens: usage.output,
        totalTokens: usage.input + usage.output,
        timestamp: new Date().toISOString(),
        metadata: {
          conversationId,
          source: 'estimation',
          note: 'Codex does not provide token counts; estimated from character count'
        }
      };
    } catch (error) {
      console.error('Failed to capture Codex tokens:', error.message);
      return this._createFallback(conversationId);
    }
  }

  async validateCredentials() {
    // Codex via MCP doesn't require separate API key
    return true;
  }

  async _estimateFromConversation(conversationId) {
    // Estimation logic:
    // - Read session logs or capture tool invocation params
    // - Count characters in prompt and response
    // - Divide by 4 (avg characters per token for code)

    return {
      input: 0,   // Will be implemented with workflow hooks
      output: 0
    };
  }

  _createFallback(conversationId) {
    return {
      model: 'codex',
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      timestamp: new Date().toISOString(),
      metadata: {
        conversationId,
        source: 'fallback'
      }
    };
  }
}

module.exports = CodexTokenCollector;
