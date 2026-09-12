/**
 * Requirements Analyzer Agent
 * Analyzes user stories and extracts structured requirements
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class RequirementsAnalyzer {
  constructor(llmProvider, logger) {
    this.llmProvider = llmProvider;
    this.logger = logger;
    this.promptPath = path.join(__dirname, '../../prompts/requirements-analyzer.md');
  }

  async analyze(userStory) {
    const startTime = Date.now();
    this.logger.info('RequirementsAnalyzer', '🔍 Analyzing requirements...');

    try {
      // Load system prompt
      const systemPrompt = fs.readFileSync(this.promptPath, 'utf8');

      // Call LLM
      const response = await this.llmProvider.generateJSON({
        systemPrompt,
        userPrompt: userStory,
        temperature: 0.3,
        maxTokens: 4096
      });

      const duration = Date.now() - startTime;
      
      this.logger.success('RequirementsAnalyzer', '✅ Requirements analysis complete', {
        duration,
        tokens: response.usage?.totalTokens
      });

      return {
        data: response.data,
        metadata: {
          agent: 'RequirementsAnalyzer',
          duration,
          tokens: response.usage,
          model: response.model,
          provider: response.provider
        }
      };
    } catch (error) {
      this.logger.error('RequirementsAnalyzer', `❌ Analysis failed: ${error.message}`);
      throw error;
    }
  }
}
