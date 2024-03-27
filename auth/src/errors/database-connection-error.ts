import CustomError from "./custom-error";

class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = "Error conecting to database";
  constructor() {
    super("Error connecting to DB");
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}

export default DatabaseConnectionError;
