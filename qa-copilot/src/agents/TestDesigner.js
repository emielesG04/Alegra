/**
 * Test Designer Agent
 * Generates test cases using ISTQB techniques
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TestDesigner {
  constructor(llmProvider, logger) {
    this.llmProvider = llmProvider;
    this.logger = logger;
    this.promptPath = path.join(__dirname, '../../prompts/test-designer.md');
  }

  async design(requirementsAnalysis) {
    const startTime = Date.now();
    this.logger.info('TestDesigner', '🧪 Generating test cases...');

    try {
      const systemPrompt = fs.readFileSync(this.promptPath, 'utf8');
      const userPrompt = JSON.stringify(requirementsAnalysis, null, 2);

      const response = await this.llmProvider.generateJSON({
        systemPrompt,
        userPrompt,
        temperature: 0.5,
        maxTokens: 4096
      });

      const duration = Date.now() - startTime;
      const testCaseCount = response.data.testCases?.length || 0;

      this.logger.success('TestDesigner', `✅ Generated ${testCaseCount} test cases`, {
        duration,
        tokens: response.usage?.totalTokens
      });

      return {
        data: response.data,
        metadata: {
          agent: 'TestDesigner',
          duration,
          tokens: response.usage,
          model: response.model,
          provider: response.provider,
          testCaseCount
        }
      };
    } catch (error) {
      this.logger.error('TestDesigner', `❌ Test generation failed: ${error.message}`);
      throw error;
    }
  }
}
