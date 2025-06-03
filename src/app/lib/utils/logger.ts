/**
 * Simple logging utility for the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: { [key in LogLevel]: number } = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Default minimum log level based on environment
const DEFAULT_MIN_LOG_LEVEL: LogLevel = 
  process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Set the minimum log level from environment or use default
const MIN_LOG_LEVEL = process.env.LOG_LEVEL as LogLevel || DEFAULT_MIN_LOG_LEVEL;

// Logger class with various log methods
class Logger {
  private context: string;
  
  constructor(context: string) {
    this.context = context;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LOG_LEVEL];
  }

  private formatMessage(message: string): string {
    return `[${this.context}] ${message}`;
  }

  private formatData(data?: any): any {
    if (!data) return undefined;
    
    // Handle sensitive data
    if (typeof data === 'object') {
      // Clone the data to avoid modifying the original
      const clonedData = { ...data };
      
      // Mask sensitive fields
      const sensitiveFields = ['password', 'token', 'api_key', 'apiKey', 'secret'];
      sensitiveFields.forEach(field => {
        if (field in clonedData) {
          clonedData[field] = '********';
        }
      });
      
      return clonedData;
    }
    
    return data;
  }

  debug(message: string, data?: any): void {
    if (!this.shouldLog('debug')) return;
    console.debug(this.formatMessage(message), this.formatData(data));
  }

  info(message: string, data?: any): void {
    if (!this.shouldLog('info')) return;
    console.info(this.formatMessage(message), this.formatData(data));
  }

  warn(message: string, data?: any): void {
    if (!this.shouldLog('warn')) return;
    console.warn(this.formatMessage(message), this.formatData(data));
  }

  error(message: string, error?: any): void {
    if (!this.shouldLog('error')) return;
    console.error(this.formatMessage(message), error instanceof Error ? error : this.formatData(error));
  }

  // Create a child logger with a sub-context
  child(subContext: string): Logger {
    return new Logger(`${this.context}:${subContext}`);
  }
}

// Create logger factory function
export function createLogger(context: string): Logger {
  return new Logger(context);
}

// Default application logger
export const logger = createLogger('app');
