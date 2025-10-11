const BaseTokenCollector = require('./base-collector');
const fs = require('fs').promises;
const path = require('path');

class ClaudeTokenCollector extends BaseTokenCollector {
  constructor() {
    super();
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.apiUrl = 'https://api.anthropic.com/v1';
  }

  async captureTokens(conversationId) {
    // Note: Claude API doesn't expose conversation-level metrics yet
    // This is a placeholder for when the API becomes available
    // Current workaround: Parse from Claude Code CLI output

    try {
      // Temporary: Extract from CLI output stored in session logs
      const sessionLog = await this._getSessionLog(conversationId);
      const tokens = this._parseTokensFromLog(sessionLog);

      return {
        model: 'claude-sonnet-4-5',
        inputTokens: tokens.input,
        outputTokens: tokens.output,
        totalTokens: tokens.input + tokens.output,
        timestamp: new Date().toISOString(),
        metadata: {
          conversationId,
          source: 'cli-output-parse'
        }
      };
    } catch (error) {
      console.error('Failed to capture Claude tokens:', error.message);
      return this._createFallback(conversationId);
    }
  }

  async validateCredentials() {
    if (!this.apiKey) {
      console.warn('ANTHROPIC_API_KEY not set');
      return false;
    }
    return true;
  }

  _parseTokensFromLog(logContent) {
    // Parse token usage from Claude Code output
    // Format: "Token usage: X/200000; Y remaining"
    const match = logContent.match(/Token usage: (\d+)\/\d+; (\d+) remaining/);

    if (match) {
      const used = parseInt(match[1]);
      return {
        input: Math.floor(used * 0.6),  // Estimate
        output: Math.floor(used * 0.4)  // Estimate
      };
    }

    return { input: 0, output: 0 };
  }

  async _getSessionLog(conversationId) {
    // Read from ai-docs/sessions/ if session summary exists
    const glob = require('glob');

    const sessionFiles = glob.sync('ai-docs/sessions/SESSION-*.md');
    if (sessionFiles.length === 0) return '';

    const latestSession = sessionFiles[sessionFiles.length - 1];
    return await fs.readFile(latestSession, 'utf8');
  }

  _createFallback(conversationId) {
    return {
      model: 'claude-sonnet-4-5',
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      timestamp: new Date().toISOString(),
      metadata: {
        conversationId,
        source: 'fallback',
        note: 'Failed to parse tokens from logs'
      }
    };
  }
}

module.exports = ClaudeTokenCollector;
