/**
 * JSON Exporter
 * Exports artifacts as pretty-printed JSON files
 */

import fs from 'fs';
import path from 'path';

export class JSONExporter {
  static export(data, filename, outputDir = 'output') {
    const filepath = path.join(outputDir, filename);
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(filepath, json, 'utf8');
    return filepath;
  }

  static exportAll(artifacts, outputDir = 'output') {
    const files = [];

    if (artifacts.requirementsAnalysis) {
      files.push(this.export(artifacts.requirementsAnalysis, 'analysis.json', outputDir));
    }

    if (artifacts.testCases) {
      files.push(this.export(artifacts.testCases, 'test-cases.json', outputDir));
    }

    if (artifacts.coverage) {
      files.push(this.export(artifacts.coverage, 'coverage.json', outputDir));
    }

    if (artifacts.review) {
      files.push(this.export(artifacts.review, 'qa-review.json', outputDir));
    }

    if (artifacts.traceability) {
      files.push(this.export(artifacts.traceability, 'traceability.json', outputDir));
    }

    return files;
  }
}
