class CustomError extends Error {
  public code: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.code = statusCode;
  }
}

export { CustomError };
