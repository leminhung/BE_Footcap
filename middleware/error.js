const ErrorResponse = require("../utils/ErrorResponse");
const { mongoEnum } = require("../enum/mongo-error.enum");
const { msgEnum } = require("../enum/message.enum");
const { codeEnum } = require("../enum/status-code.enum");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error on dev
  console.log(err.stack);

  // MongoDB validation failed
  if (err.name === mongoEnum.VALIDATION) {
    const message = Object.values(err.errors).map(
      (value) => value.message + " "
    );
    error = new ErrorResponse(message, codeEnum.NOT_FOUND);
  }

  // MongoDB bad ObjectID
  if (err.name === mongoEnum.CAST) {
    error = new ErrorResponse(msgEnum.DATA_NOT_FOUND, codeEnum.NOT_FOUND);
  }

  //MongoDB duplicate value key
  if (err.code === mongoEnum.DUPLICATE) {
    error = new ErrorResponse(msgEnum.DUPLICATE_VALUE, codeEnum.BAD_REQUEST);
  }

  res
    .status(error.statusCode || codeEnum.SERVER_ERROR)
    .json({ msg: error.message || msgEnum.SERVER_ERROR });
};

module.exports = errorHandler;
