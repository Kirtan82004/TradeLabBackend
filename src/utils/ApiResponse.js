// utils/ApiResponse.js

class ApiResponse {
  constructor(statusCode, data = null, message = "Success", meta = {}) {
    this.statusCode = statusCode;
    this.success = statusCode < 400; // true if success, false if error
    this.message = message;
    this.data = data;
    this.meta = Object.keys(meta).length ? meta : undefined; // optional
  }
}

export { ApiResponse };
