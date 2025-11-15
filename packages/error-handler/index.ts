export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }
}

// Not Found Error

export class NotFoundError extends AppError {
  constructor(message = "Resource Not Found") {
    super(message, 404);
  }
}

// Validation Error (use for Joi/zod/react-hook-form validation errors etc.)

export class ValidationError extends AppError {
  constructor(
    message = "Validation Error / Invalid request data",
    details?: any
  ) {
    super(message, 400, true, details);
  }
}

// Authentication Error

export class AuthenticationError extends AppError {
  constructor(message = "Unauthenticated / Invalid Credentials") {
    super(message, 401);
  }
}

// Forbidden Error

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden Access") {
    super(message, 403);
  }
}

// Database Error

export class DatabaseError extends AppError {
  constructor(message = "Database Error", details?: any) {
    super(message, 500, false, details);
  }
}

// Rate Limit Error

export class RateLimitError extends AppError {
  constructor(message = "Too Many Requests") {
    super(message, 429);
  }
}