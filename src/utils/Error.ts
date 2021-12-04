class BaseError extends Error {
  statusCode?: number;
  name: string;

  constructor(message: string, statusCode?: number) {
    super(message);

    if (statusCode !== undefined) this.statusCode = statusCode;
    this.name = 'BaseError';
  }
}

export default BaseError;
