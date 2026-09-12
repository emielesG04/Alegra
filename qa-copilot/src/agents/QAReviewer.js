/**
 * QA Reviewer Agent
 * Validates all outputs for quality and hallucinations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class QAReviewer {
  constructor(llmProvider, logger) {
    this.llmProvider = llmProvider;
    this.logger = logger;
    this.promptPath = path.join(__dirname, '../../prompts/qa-reviewer.md');
  }

  async review(requirementsAnalysis, testCases, coverage) {
    const startTime = Date.now();
    this.logger.info('QAReviewer', '🔎 Reviewing outputs...');

    try {
      const systemPrompt = fs.readFileSync(this.promptPath, 'utf8');
      const userPrompt = JSON.stringify({
        requirementsAnalysis,
        testCases,
        coverage
      }, null, 2);

      const response = await this.llmProvider.generateJSON({
        systemPrompt,
        userPrompt,
        temperature: 0.2,
        maxTokens: 4096
      });

      const duration = Date.now() - startTime;
      const verdict = response.data.overallVerdict || 'UNKNOWN';

      this.logger.success('QAReviewer', `✅ Review complete: ${verdict}`, {
        duration,
        tokens: response.usage?.totalTokens
      });

      return {
        data: response.data,
        metadata: {
          agent: 'QAReviewer',
          duration,
          tokens: response.usage,
          model: response.model,
          provider: response.provider,
          verdict
        }
      };
    } catch (error) {
      this.logger.error('QAReviewer', `❌ Review failed: ${error.message}`);
      throw error;
    }
  }
}
