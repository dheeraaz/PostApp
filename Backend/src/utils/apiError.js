class apiError extends Error {
  constructor(
    statusCode,
    message = "Something Went Wrong",
    name = "",
    errors = "",
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = null;
    this.success = false;

    if (name.trim()) this.name = name;

    if (stack.trim()) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructore);
    }
  }
}

export default apiError;
