import { ValidationError } from "express-validator";

class CustomError extends Error {
  public success: boolean;
  public code: number;
  public details?: string | string[] | ValidationError[];
  constructor(
    success: boolean,
    message: string,
    statusCode: number,
    details?: any
  ) {
    super(message);
    this.success = success;
    this.code = statusCode;
    this.details = details;
  }
}

export { CustomError };
