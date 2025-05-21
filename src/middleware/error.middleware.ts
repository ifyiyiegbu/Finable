import { Request, Response, NextFunction } from 'express';
import { IAppError } from '../interfaces/error.interface';
import logger from '../utils/logger';

class AppError extends Error implements IAppError {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly stack?: string;

  constructor(message: string, statusCode: number, isOperational = true, stack = '') {
    super(message);
    this.name = 'AppError'; // Sets the error name
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
    name: string;
}

export const errorHandler = (
  err: Error | IAppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = err;
  
  // If the error is not an instance of AppError, convert it
  if (!(error instanceof AppError)) {
    let statusCode = 500;
    let message = 'Internal server error';
    let isOperational = false;
    
    // Handle common errors
    if (error.message === 'An account with this email already exists') {
      statusCode = 409;
      message = error.message;
      isOperational = true;
    } else if (error.message === 'An account with this phone number already exists') {
      statusCode = 409;
      message = error.message;
      isOperational = true;
    } else if (error.message === 'Account not found') {
      statusCode = 404;
      message = error.message;
      isOperational = true;
    } else if (error.message === 'Failed to encrypt data' || error.message === 'Failed to decrypt data') {
      statusCode = 500;
      message = 'Error processing secure data';
      isOperational = true;
    }
    
    error = new AppError(message, statusCode, isOperational, error.stack);
  }
  
  // Log the error
  if ((error as IAppError).isOperational) {
    logger.warn(`Operational error: ${error.message}`);
  } else {
    logger.error('Unhandled error:', error);
  }
  
  // Send the error response
  res.status((error as IAppError).statusCode || 500).json({
    status: 'error',
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};
