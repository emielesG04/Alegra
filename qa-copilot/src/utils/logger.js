/**
 * Logger Utility
 * 
 * Structured logging for QA Copilot execution
 * Logs execution ID, timestamp, agent, duration, success/failure
 * NEVER logs API keys or secrets
 */

import { nanoid } from 'nanoid';

class Logger {
  constructor() {
    this.executionId = nanoid(10);
    this.logs = [];
    this.startTime = Date.now();
  }

  log(level, agent, message, metadata = {}) {
    const logEntry = {
      executionId: this.executionId,
      timestamp: new Date().toISOString(),
      level,
      agent,
      message,
      metadata: this.sanitizeMetadata(metadata)
    };

    this.logs.push(logEntry);

    // Console output with colors
    const emoji = {
      info: 'ℹ️',
      success: '✅',
      warn: '⚠️',
      error: '❌',
      debug: '🔍'
    }[level] || 'ℹ️';

    console.log(`${emoji} [${agent}] ${message}`);

    if (metadata.duration) {
      console.log(`   ⏱️  Duration: ${metadata.duration}ms`);
    }
    if (metadata.tokens) {
      console.log(`   🎫 Tokens: ${metadata.tokens}`);
    }
  }

  info(agent, message, metadata) {
    this.log('info', agent, message, metadata);
  }

  success(agent, message, metadata) {
    this.log('success', agent, message, metadata);
  }

  warn(agent, message, metadata) {
    this.log('warn', agent, message, metadata);
  }

  error(agent, message, metadata) {
    this.log('error', agent, message, metadata);
  }

  debug(agent, message, metadata) {
    this.log('debug', agent, message, metadata);
  }

  /**
   * Sanitize metadata to prevent logging secrets
   */
  sanitizeMetadata(metadata) {
    const sanitized = { ...metadata };
    
    // Remove sensitive fields
    const sensitiveKeys = ['apiKey', 'api_key', 'token', 'password', 'secret', 'authorization'];
    
    for (const key of sensitiveKeys) {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  getExecutionId() {
    return this.executionId;
  }

  getExecutionTime() {
    return Date.now() - this.startTime;
  }

  getSummary() {
    const errors = this.logs.filter(log => log.level === 'error').length;
    const warnings = this.logs.filter(log => log.level === 'warn').length;
    const totalTime = this.getExecutionTime();

    return {
      executionId: this.executionId,
      totalTime,
      totalLogs: this.logs.length,
      errors,
      warnings,
      success: errors === 0
    };
  }

  exportLogs() {
    return {
      executionId: this.executionId,
      startTime: new Date(this.startTime).toISOString(),
      endTime: new Date().toISOString(),
      duration: this.getExecutionTime(),
      logs: this.logs
    };
  }
}

// Singleton instance
let loggerInstance = null;

export function createLogger() {
  loggerInstance = new Logger();
  return loggerInstance;
}

export function getLogger() {
  if (!loggerInstance) {
    loggerInstance = new Logger();
  }
  return loggerInstance;
}
