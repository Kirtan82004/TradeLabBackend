
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    // Ensure valid HTTP status code
    if (statusCode < 100 || statusCode > 599) {
      throw new Error("❌ Invalid status code provided");
    }

    super(message);

    this.statusCode = statusCode;
    this.success = false; // all ApiError responses are failures
    this.message = message;
    this.errors = errors;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
