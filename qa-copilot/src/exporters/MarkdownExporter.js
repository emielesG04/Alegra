/**
 * Markdown Exporter
 * Exports artifacts as human-readable Markdown
 */

import fs from 'fs';
import path from 'path';

export class MarkdownExporter {
  static exportReport(artifacts, filename = 'qa-copilot-report.md', outputDir = 'output') {
    const filepath = path.join(outputDir, filename);

    let markdown = '# AI QA COPILOT - TEST ANALYSIS REPORT\n\n';
    markdown += `**Generated**: ${new Date().toISOString()}\n\n`;
    markdown += '---\n\n';

    // Requirements Analysis
    if (artifacts.requirementsAnalysis) {
      markdown += this.formatRequirementsAnalysis(artifacts.requirementsAnalysis);
    }

    // Test Cases
    if (artifacts.testCases) {
      markdown += this.formatTestCases(artifacts.testCases);
    }

    // Coverage
    if (artifacts.coverage) {
      markdown += this.formatCoverage(artifacts.coverage);
    }

    // Review
    if (artifacts.review) {
      markdown += this.formatReview(artifacts.review);
    }

    fs.writeFileSync(filepath, markdown, 'utf8');
    return filepath;
  }

  static formatRequirementsAnalysis(analysis) {
    let md = '## 📋 REQUIREMENTS ANALYSIS\n\n';

    md += '### Business Rules\n';
    analysis.businessRules?.forEach((rule, i) => {
      md += `${i + 1}. ${rule}\n`;
    });
    md += '\n';

    md += '### Actors\n';
    analysis.actors?.forEach(actor => {
      md += `- ${actor}\n`;
    });
    md += '\n';

    md += '### Gaps Identified\n';
    if (analysis.gaps?.length > 0) {
      analysis.gaps.forEach(gap => {
        md += `- ⚠️ ${gap}\n`;
      });
    } else {
      md += '- None\n';
    }
    md += '\n';

    md += '### Risks Identified\n';
    if (analysis.risks?.length > 0) {
      analysis.risks.forEach(risk => {
        md += `- 🔴 ${risk}\n`;
      });
    } else {
      md += '- None\n';
    }
    md += '\n---\n\n';

    return md;
  }

  static formatTestCases(testCases) {
    let md = '## 🧪 TEST CASES\n\n';
    md += `**Total Test Cases**: ${testCases.length}\n\n`;

    testCases.forEach((tc, i) => {
      md += `### ${i + 1}. ${tc.title}\n\n`;
      md += `- **ID**: ${tc.id}\n`;
      md += `- **Requirement**: ${tc.requirement}\n`;
      md += `- **Type**: ${tc.type}\n`;
      md += `- **Technique**: ${tc.technique}\n`;
      md += `- **Priority**: ${tc.priority} | **Risk**: ${tc.risk}\n`;
      md += `- **Preconditions**: ${tc.preconditions}\n`;
      md += `- **Test Data**: ${tc.testData}\n\n`;

      md += '**Steps**:\n';
      tc.steps?.forEach(step => {
        md += `${step}\n`;
      });
      md += '\n';

      md += `**Expected Result**: ${tc.expectedResult}\n\n`;
      md += `**Automatable**: ${tc.automatable ? 'Yes ✅' : 'No ❌'}\n`;
      if (tc.gap) {
        md += `**⚠️ GAP DETECTED**: This test exposes a requirements gap\n`;
      }
      md += '\n---\n\n';
    });

    return md;
  }

  static formatCoverage(coverage) {
    let md = '## 📊 COVERAGE ANALYSIS\n\n';

    md += '### Coverage by Category\n\n';
    if (coverage.coverageByCategory) {
      Object.entries(coverage.coverageByCategory).forEach(([category, data]) => {
        md += `**${category}**: ${data.status} ${data.percentage}%\n`;
        if (data.details) {
          md += `  - ${data.details}\n`;
        }
        md += '\n';
      });
    }

    md += '### Coverage Gaps\n';
    if (coverage.coverageGaps?.length > 0) {
      coverage.coverageGaps.forEach(gap => {
        md += `- ⚠️ ${gap}\n`;
      });
    } else {
      md += '- None identified ✅\n';
    }
    md += '\n---\n\n';

    return md;
  }

  static formatReview(review) {
    let md = '## 🔎 QA REVIEW\n\n';
    md += `**Overall Verdict**: ${review.overallVerdict}\n\n`;

    if (review.summary) {
      md += '### Summary\n';
      md += `- **Total Test Cases**: ${review.summary.totalTestCases}\n`;
      md += `- **Critical Issues**: ${review.summary.criticalIssues}\n`;
      md += `- **Warnings**: ${review.summary.warnings}\n`;
      md += `- **Quality Score**: ${review.summary.qualityScore}\n\n`;
    }

    if (review.recommendations?.length > 0) {
      md += '### Recommendations\n';
      review.recommendations.forEach(rec => {
        md += `- ${rec}\n`;
      });
      md += '\n';
    }

    md += `**Ready for Human Review**: ${review.readyForHumanReview ? 'Yes ✅' : 'No ❌'}\n\n`;

    return md;
  }
}
