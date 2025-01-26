class ApiError extends Error {
  public statusCode: number;
  public errors?: [];

  constructor({
    statusCode,
    message,
    errors,
  }: {
    statusCode: number;
    message: string;
    errors?: [];
  }) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export default ApiError;
