/**
 * OpenAI Provider Implementation
 * 
 * Implements LLMProvider interface for OpenAI GPT models
 */

import OpenAI from 'openai';
import { LLMProvider } from './LLMProvider.js';

export class OpenAIProvider extends LLMProvider {
  constructor(apiKey, model = 'gpt-4-turbo') {
    super();
    this.apiKey = apiKey;
    this.model = model;
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  async generateJSON({ systemPrompt, userPrompt, temperature = 0.3, maxTokens = 4096 }) {
    if (!this.client) {
      throw new Error('OpenAI provider not configured. Missing API key.');
    }

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      const usage = response.usage;

      // Parse JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(content);
      } catch (parseError) {
        throw new Error(`Failed to parse OpenAI response as JSON: ${parseError.message}\nRaw response: ${content}`);
      }

      return {
        data: parsedResponse,
        usage: {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens
        },
        model: this.model,
        provider: 'openai'
      };
    } catch (error) {
      if (error.code === 'insufficient_quota') {
        throw new Error('OpenAI API quota exceeded. Check your billing settings.');
      }
      if (error.code === 'rate_limit_exceeded') {
        throw new Error('OpenAI rate limit exceeded. Please wait and retry.');
      }
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  getProviderName() {
    return 'OpenAI';
  }

  getModelName() {
    return this.model;
  }

  isConfigured() {
    return this.client !== null;
  }
}
