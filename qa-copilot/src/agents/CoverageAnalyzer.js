/**
 * Coverage Analyzer Agent
 * Builds traceability and analyzes test coverage
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CoverageAnalyzer {
  constructor(llmProvider, logger) {
    this.llmProvider = llmProvider;
    this.logger = logger;
    this.promptPath = path.join(__dirname, '../../prompts/coverage-analyzer.md');
  }

  async analyze(requirementsAnalysis, testCases) {
    const startTime = Date.now();
    this.logger.info('CoverageAnalyzer', '📊 Analyzing coverage...');

    try {
      const systemPrompt = fs.readFileSync(this.promptPath, 'utf8');
      const userPrompt = JSON.stringify({
        requirementsAnalysis,
        testCases
      }, null, 2);

      const response = await this.llmProvider.generateJSON({
        systemPrompt,
        userPrompt,
        temperature: 0.3,
        maxTokens: 4096
      });

      const duration = Date.now() - startTime;

      this.logger.success('CoverageAnalyzer', '✅ Coverage analysis complete', {
        duration,
        tokens: response.usage?.totalTokens
      });

      return {
        data: response.data,
        metadata: {
          agent: 'CoverageAnalyzer',
          duration,
          tokens: response.usage,
          model: response.model,
          provider: response.provider
        }
      };
    } catch (error) {
      this.logger.error('CoverageAnalyzer', `❌ Coverage analysis failed: ${error.message}`);
      throw error;
    }
  }
}
