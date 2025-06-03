import { NextResponse } from 'next/server';
import { createLogger } from './logger';

const logger = createLogger('error-handler');

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  public statusCode: number;
  public context?: any;

  constructor(message: string, statusCode: number = 500, context?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.context = context;
  }
}

/**
 * Handle API errors and return appropriate NextResponse
 */
export function handleApiError(error: unknown): NextResponse {
  // If it's already an ApiError, use its status code
  if (error instanceof ApiError) {
    logger.error(`API error (${error.statusCode}): ${error.message}`, error.context);
    
    return NextResponse.json(
      { error: error.message, ...error.context },
      { status: error.statusCode }
    );
  }

  // For validation errors, return 400
  if (error instanceof TypeError || error instanceof RangeError || error instanceof SyntaxError) {
    logger.error(`Validation error: ${error.message}`);
    
    return NextResponse.json(
      { error: 'Invalid request: ' + error.message },
      { status: 400 }
    );
  }

  // For all other errors, log and return 500
  const message = error instanceof Error ? error.message : 'Unknown error';
  logger.error(`Unhandled error: ${message}`, error);
  
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

/**
 * Validate request data against a schema
 */
export function validateRequest<T>(data: any, schema: any): T {
  try {
    return schema.parse(data);
  } catch (error) {
    throw new ApiError('Validation failed', 400, { validationErrors: error });
  }
}
