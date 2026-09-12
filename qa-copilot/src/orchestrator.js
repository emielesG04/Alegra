/**
 * Orchestrator
 * Coordinates the execution of all agents and manages workflow
 */

import { RequirementsAnalyzer } from './agents/RequirementsAnalyzer.js';
import { TestDesigner } from './agents/TestDesigner.js';
import { CoverageAnalyzer } from './agents/CoverageAnalyzer.js';
import { QAReviewer } from './agents/QAReviewer.js';
import { SchemaValidator } from './validators/schemaValidator.js';
import { JSONExporter } from './exporters/JSONExporter.js';
import { CSVExporter } from './exporters/CSVExporter.js';
import { MarkdownExporter } from './exporters/MarkdownExporter.js';

export class Orchestrator {
  constructor(llmProvider, logger) {
    this.llmProvider = llmProvider;
    this.logger = logger;

    // Initialize agents
    this.requirementsAnalyzer = new RequirementsAnalyzer(llmProvider, logger);
    this.testDesigner = new TestDesigner(llmProvider, logger);
    this.coverageAnalyzer = new CoverageAnalyzer(llmProvider, logger);
    this.qaReviewer = new QAReviewer(llmProvider, logger);
  }

  async execute(userStory, outputDir = 'output') {
    const startTime = Date.now();
    this.logger.info('Orchestrator', '🚀 Starting AI QA Copilot execution');
    this.logger.info('Orchestrator', `📝 Input length: ${userStory.length} characters`);

    const results = {
      success: false,
      artifacts: {},
      metadata: {},
      errors: []
    };

    try {
      // STEP 1: Requirements Analysis
      this.logger.info('Orchestrator', '\n[1/4] Requirements Analysis');
      const reqAnalysisResult = await this.requirementsAnalyzer.analyze(userStory);
      
      // Validate
      const reqValidation = SchemaValidator.validateRequirementsAnalysis(reqAnalysisResult.data);
      if (!reqValidation.valid) {
        throw new Error(`Requirements analysis validation failed:\n${reqValidation.formatted}`);
      }

      results.artifacts.requirementsAnalysis = reqAnalysisResult.data;
      results.metadata.requirementsAnalysis = reqAnalysisResult.metadata;

      // STEP 2: Test Design
      this.logger.info('Orchestrator', '\n[2/4] Test Design');
      const testDesignResult = await this.testDesigner.design(reqAnalysisResult.data);

      // Validate
      const testValidation = SchemaValidator.validateTestCases(testDesignResult.data);
      if (!testValidation.valid) {
        throw new Error(`Test cases validation failed:\n${testValidation.formatted}`);
      }

      results.artifacts.testCases = testDesignResult.data.testCases;
      results.metadata.testDesigner = testDesignResult.metadata;

      // STEP 3: Coverage Analysis
      this.logger.info('Orchestrator', '\n[3/4] Coverage Analysis');
      const coverageResult = await this.coverageAnalyzer.analyze(
        reqAnalysisResult.data,
        testDesignResult.data.testCases
      );

      results.artifacts.coverage = coverageResult.data;
      results.artifacts.traceability = coverageResult.data.traceability;
      results.metadata.coverageAnalyzer = coverageResult.metadata;

      // STEP 4: QA Review
      this.logger.info('Orchestrator', '\n[4/4] QA Review');
      const reviewResult = await this.qaReviewer.review(
        reqAnalysisResult.data,
        testDesignResult.data.testCases,
        coverageResult.data
      );

      results.artifacts.review = reviewResult.data;
      results.metadata.qaReviewer = reviewResult.metadata;

      // STEP 5: Export Artifacts
      this.logger.info('Orchestrator', '\n📦 Exporting artifacts...');
      
      const jsonFiles = JSONExporter.exportAll(results.artifacts, outputDir);
      this.logger.success('Orchestrator', `✅ Exported ${jsonFiles.length} JSON files`);

      const csvFile = CSVExporter.exportTestCases(results.artifacts.testCases, 'test-cases.csv', outputDir);
      this.logger.success('Orchestrator', `✅ Exported CSV: ${csvFile}`);

      const mdFile = MarkdownExporter.exportReport(results.artifacts, 'qa-copilot-report.md', outputDir);
      this.logger.success('Orchestrator', `✅ Exported Markdown: ${mdFile}`);

      // Success
      results.success = true;
      const totalDuration = Date.now() - startTime;

      this.logger.success('Orchestrator', `\n✨ QA Copilot execution completed successfully!`);
      this.logger.info('Orchestrator', `⏱️  Total execution time: ${totalDuration}ms`);
      
      // Summary
      const testCount = results.artifacts.testCases?.length || 0;
      const verdict = results.artifacts.review?.overallVerdict || 'UNKNOWN';
      
      this.logger.info('Orchestrator', '\n📊 SUMMARY:');
      this.logger.info('Orchestrator', `   Test Cases Generated: ${testCount}`);
      this.logger.info('Orchestrator', `   QA Review Verdict: ${verdict}`);
      this.logger.info('Orchestrator', `   Artifacts Location: ${outputDir}/`);

      results.metadata.totalDuration = totalDuration;

      return results;

    } catch (error) {
      results.success = false;
      results.errors.push(error.message);
      this.logger.error('Orchestrator', `\n❌ Execution failed: ${error.message}`);
      throw error;
    }
  }
}
