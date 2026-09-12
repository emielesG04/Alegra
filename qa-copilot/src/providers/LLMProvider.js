/**
 * LLM Provider Interface
 * 
 * Abstract interface for LLM providers (OpenAI, Anthropic, etc.)
 * Allows switching providers without changing application code
 */

export class LLMProvider {
  /**
   * Generate completion with structured JSON output
   * @param {Object} params
   * @param {string} params.systemPrompt - System prompt defining role and task
   * @param {string} params.userPrompt - User input/request
   * @param {number} params.temperature - Temperature (0-1)
   * @param {number} params.maxTokens - Maximum tokens to generate
   * @returns {Promise<Object>} Parsed JSON response
   */
  async generateJSON(params) {
    throw new Error('generateJSON() must be implemented by provider');
  }

  /**
   * Get provider name
   * @returns {string}
   */
  getProviderName() {
    throw new Error('getProviderName() must be implemented by provider');
  }

  /**
   * Get model name
   * @returns {string}
   */
  getModelName() {
    throw new Error('getModelName() must be implemented by provider');
  }

  /**
   * Check if provider is configured
   * @returns {boolean}
   */
  isConfigured() {
    throw new Error('isConfigured() must be implemented by provider');
  }
}
