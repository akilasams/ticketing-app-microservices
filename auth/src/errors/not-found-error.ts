import CustomError from "./custom-error";

class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Route not found");
  }

  serializeErrors() {
    return [{ message: "Not Found" }];
  }
}

export default NotFoundError;
