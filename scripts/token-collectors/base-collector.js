/**
 * Base Token Collector Interface
 * All collectors implement this interface
 */
class BaseTokenCollector {
  /**
   * Capture token usage from API
   * @param {string} identifier - Conversation ID, request ID, etc.
   * @returns {Promise<TokenUsage>}
   */
  async captureTokens(identifier) {
    throw new Error('Must implement captureTokens()');
  }

  /**
   * Validate API credentials
   * @returns {Promise<boolean>}
   */
  async validateCredentials() {
    throw new Error('Must implement validateCredentials()');
  }
}

/**
 * @typedef {Object} TokenUsage
 * @property {string} model - Model name (e.g., 'claude-sonnet-4-5')
 * @property {number} inputTokens - Input tokens used
 * @property {number} outputTokens - Output tokens used
 * @property {number} totalTokens - Total tokens (input + output)
 * @property {string} timestamp - ISO timestamp
 * @property {Object} metadata - Additional context
 */

module.exports = BaseTokenCollector;
