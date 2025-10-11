const BaseTokenCollector = require('./base-collector');

class GeminiTokenCollector extends BaseTokenCollector {
  constructor() {
    super();
    this.apiKey = process.env.GEMINI_API_KEY;
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  async captureTokens(requestId) {
    // Gemini API provides token counts in response
    // Via MCP: gemini-cli returns usage metadata
    try {
      // Parse from MCP response metadata
      const usage = await this._getMcpUsage(requestId);

      return {
        model: usage.model || 'gemini-2.5-pro',
        inputTokens: usage.promptTokenCount || 0,
        outputTokens: usage.candidatesTokenCount || 0,
        totalTokens: usage.totalTokenCount || 0,
        timestamp: new Date().toISOString(),
        metadata: {
          requestId,
          source: 'gemini-mcp'
        }
      };
    } catch (error) {
      console.error('Failed to capture Gemini tokens:', error.message);
      return this._createFallback(requestId);
    }
  }

  async validateCredentials() {
    if (!this.apiKey) {
      console.warn('GEMINI_API_KEY not set');
      return false;
    }

    try {
      // Test API with minimal request
      const response = await fetch(
        `${this.apiUrl}/models?key=${this.apiKey}`
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  async _getMcpUsage(requestId) {
    // MCP tool responses include usage metadata
    // This requires storing MCP responses in session logs
    // Placeholder: Will be implemented in workflow hooks
    return {
      model: 'gemini-2.5-pro',
      promptTokenCount: 0,
      candidatesTokenCount: 0,
      totalTokenCount: 0
    };
  }

  _createFallback(requestId) {
    return {
      model: 'gemini-2.5-pro',
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      timestamp: new Date().toISOString(),
      metadata: {
        requestId,
        source: 'fallback'
      }
    };
  }
}

module.exports = GeminiTokenCollector;
