/**
 * CSV Exporter
 * Exports test cases as CSV for spreadsheet compatibility
 */

import fs from 'fs';
import path from 'path';

export class CSVExporter {
  static exportTestCases(testCases, filename = 'test-cases.csv', outputDir = 'output') {
    const filepath = path.join(outputDir, filename);

    // CSV Headers
    const headers = [
      'ID',
      'Title',
      'Requirement',
      'Type',
      'Technique',
      'Priority',
      'Risk',
      'Preconditions',
      'Test Data',
      'Steps',
      'Expected Result',
      'Evidence Required',
      'Automatable',
      'Gap'
    ];

    // CSV Rows
    const rows = testCases.map(tc => [
      tc.id || '',
      this.escape(tc.title || ''),
      tc.requirement || '',
      tc.type || '',
      tc.technique || '',
      tc.priority || '',
      tc.risk || '',
      this.escape(tc.preconditions || ''),
      this.escape(tc.testData || ''),
      this.escape((tc.steps || []).join('; ')),
      this.escape(tc.expectedResult || ''),
      tc.evidenceRequired ? 'Yes' : 'No',
      tc.automatable ? 'Yes' : 'No',
      tc.gap ? 'Yes' : 'No'
    ]);

    // Build CSV content
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    fs.writeFileSync(filepath, csv, 'utf8');
    return filepath;
  }

  static escape(str) {
    if (!str) return '';
    // Escape quotes and wrap in quotes if contains comma, newline, or quote
    const escaped = str.replace(/"/g, '""');
    if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
      return `"${escaped}"`;
    }
    return escaped;
  }
}
