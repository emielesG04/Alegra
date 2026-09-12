#!/usr/bin/env node

/**
 * AI QA COPILOT - CLI Entry Point
 * 
 * Usage:
 *   npm run demo              # AI mode with default input
 *   npm run demo:mock         # Mock mode (no API cost)
 *   npm run demo -- --input=path/to/story.txt
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OpenAIProvider } from './providers/OpenAIProvider.js';
import { MockProvider } from './providers/MockProvider.js';
import { Orchestrator } from './orchestrator.js';
import { createLogger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    mode: 'ai', // default mode
    input: null
  };

  args.forEach(arg => {
    if (arg === '--mode=mock' || arg.includes('demo:mock')) {
      config.mode = 'mock';
    }
    if (arg.startsWith('--input=')) {
      config.input = arg.split('=')[1];
    }
  });

  return config;
}

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║      AI QA COPILOT v1.0.0                ║');
  console.log('║      ACME Corp - Technical Challenge     ║');
  console.log('╚══════════════════════════════════════════╝\n');

  const config = parseArgs();
  const logger = createLogger();

  try {
    // 1. Select LLM Provider
    let provider;
    if (config.mode === 'mock') {
      logger.info('Main', '🎭 Running in MOCK mode (no API cost)');
      provider = new MockProvider();
    } else {
      logger.info('Main', '🤖 Running in AI mode');
      const apiKey = process.env.OPENAI_API_KEY;
      const model = process.env.OPENAI_MODEL || 'gpt-4-turbo';
      
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY not found in environment. Please create .env file.');
      }

      provider = new OpenAIProvider(apiKey, model);
      logger.info('Main', `🔧 Using: ${provider.getProviderName()} - ${provider.getModelName()}`);
    }

    // 2. Load User Story
    const defaultInput = path.join(__dirname, '../evaluation/cases/case-001-complete.txt');
    const inputPath = config.input || defaultInput;

    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    const userStory = fs.readFileSync(inputPath, 'utf8');
    logger.info('Main', `📖 Loaded user story: ${inputPath}`);

    // 3. Create output directory
    const outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 4. Execute QA Copilot
    const orchestrator = new Orchestrator(provider, logger);
    const results = await orchestrator.execute(userStory, outputDir);

    // 5. Display results
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║           EXECUTION COMPLETE             ║');
    console.log('╚══════════════════════════════════════════╝\n');

    console.log('📁 Generated Artifacts:');
    console.log('   ✅ output/analysis.json');
    console.log('   ✅ output/test-cases.json');
    console.log('   ✅ output/coverage.json');
    console.log('   ✅ output/qa-review.json');
    console.log('   ✅ output/traceability.json');
    console.log('   ✅ output/test-cases.csv');
    console.log('   ✅ output/qa-copilot-report.md');

    console.log('\n📊 Execution Summary:');
    console.log(`   Execution ID: ${logger.getExecutionId()}`);
    console.log(`   Duration: ${results.metadata.totalDuration}ms`);
    console.log(`   Test Cases: ${results.artifacts.testCases?.length || 0}`);
    console.log(`   QA Verdict: ${results.artifacts.review?.overallVerdict || 'N/A'}`);

    if (config.mode === 'ai' && results.metadata.requirementsAnalysis?.tokens) {
      const totalTokens = 
        (results.metadata.requirementsAnalysis?.tokens?.totalTokens || 0) +
        (results.metadata.testDesigner?.tokens?.totalTokens || 0) +
        (results.metadata.coverageAnalyzer?.tokens?.totalTokens || 0) +
        (results.metadata.qaReviewer?.tokens?.totalTokens || 0);
      
      console.log(`   Total Tokens: ${totalTokens}`);
    }

    console.log('\n✨ Success! Review the artifacts in the output/ directory.\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check your .env file exists and has OPENAI_API_KEY');
    console.error('   2. Try running in mock mode: npm run demo:mock');
    console.error('   3. Check the input file exists and is readable');
    console.error('\n');
    
    logger.error('Main', error.message);
    process.exit(1);
  }
}

// Run
main();
