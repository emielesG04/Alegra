/**
 * Schema Validator
 * 
 * Validates AI-generated JSON outputs against defined schemas
 * Prevents application crashes from malformed LLM responses
 */

import Ajv from 'ajv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ajv = new Ajv({ allErrors: true, strict: false });

// Load schemas
const schemasPath = path.join(__dirname, '../../schemas');

const requirementsAnalysisSchema = JSON.parse(
  fs.readFileSync(path.join(schemasPath, 'requirements-analysis-schema.json'), 'utf8')
);

const testCaseSchema = JSON.parse(
  fs.readFileSync(path.join(schemasPath, 'test-case-schema.json'), 'utf8')
);

// Compile validators
const validateRequirementsAnalysis = ajv.compile(requirementsAnalysisSchema);
const validateTestCase = ajv.compile(testCaseSchema);

export class SchemaValidator {
  /**
   * Validate requirements analysis output
   */
  static validateRequirementsAnalysis(data) {
    const valid = validateRequirementsAnalysis(data);
    
    if (!valid) {
      return {
        valid: false,
        errors: validateRequirementsAnalysis.errors,
        formatted: this.formatErrors(validateRequirementsAnalysis.errors)
      };
    }

    return { valid: true, errors: null };
  }

  /**
   * Validate test cases array output
   */
  static validateTestCases(data) {
    // Validate that testCases array exists
    if (!data.testCases || !Array.isArray(data.testCases)) {
      return {
        valid: false,
        errors: [{ message: 'Missing or invalid testCases array' }],
        formatted: 'Output must contain a testCases array'
      };
    }

    // Validate each test case
    const errors = [];
    data.testCases.forEach((testCase, index) => {
      const valid = validateTestCase(testCase);
      if (!valid) {
        errors.push({
          testCaseIndex: index,
          testCaseId: testCase.id || 'unknown',
          errors: validateTestCase.errors
        });
      }
    });

    if (errors.length > 0) {
      return {
        valid: false,
        errors,
        formatted: this.formatTestCaseErrors(errors)
      };
    }

    return { valid: true, errors: null };
  }

  /**
   * Attempt to repair common JSON issues
   */
  static attemptRepair(jsonString) {
    try {
      // Already valid JSON
      return JSON.parse(jsonString);
    } catch (error) {
      // Attempt repairs
      let repaired = jsonString;

      // Remove markdown code blocks if present
      repaired = repaired.replace(/```json\n?/g, '');
      repaired = repaired.replace(/```\n?/g, '');

      // Remove extra text before/after JSON
      const jsonMatch = repaired.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        repaired = jsonMatch[0];
      }

      // Try parsing again
      try {
        return JSON.parse(repaired);
      } catch (repairError) {
        throw new Error(`JSON repair failed: ${repairError.message}`);
      }
    }
  }

  /**
   * Format validation errors for human reading
   */
  static formatErrors(errors) {
    if (!errors || errors.length === 0) return '';

    return errors.map(err => {
      const path = err.instancePath || 'root';
      return `  - ${path}: ${err.message}`;
    }).join('\n');
  }

  /**
   * Format test case validation errors
   */
  static formatTestCaseErrors(errors) {
    if (!errors || errors.length === 0) return '';

    return errors.map(err => {
      return `Test Case ${err.testCaseId} (index ${err.testCaseIndex}):\n${this.formatErrors(err.errors)}`;
    }).join('\n\n');
  }

  /**
   * Validate any data against a custom schema
   */
  static validate(data, schema) {
    const validator = ajv.compile(schema);
    const valid = validator(data);

    if (!valid) {
      return {
        valid: false,
        errors: validator.errors,
        formatted: this.formatErrors(validator.errors)
      };
    }

    return { valid: true, errors: null };
  }
}
