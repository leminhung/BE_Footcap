const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/ErrorResponse");
const { msgEnum } = require("../enum/message.enum");
const { codeEnum } = require("../enum/status-code.enum");
const client = require("../config/redis");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse(msgEnum.UNAUTHORIZED, codeEnum.UNAUTHORIZED));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.log(error.message);
    return next(new ErrorResponse(msgEnum.UNAUTHORIZED, codeEnum.UNAUTHORIZED));
  }
});

// Grant access ti specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(new ErrorResponse(msgEnum.UNAUTHORIZED, codeEnum.FORBIDDEN));
    }
    next();
  };
};

exports.verifyRefreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return next(new ErrorResponse(msgEnum.TOKEN_INVALID, codeEnum.BAD_REQUEST));

  try {
    const decoded = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const redisToken = await client.get(decoded.id);

    if (!redisToken)
      return next(
        new ErrorResponse(msgEnum.TOKEN_INVALID, codeEnum.BAD_REQUEST)
      );

    if (redisToken !== refreshToken)
      return next(
        new ErrorResponse(msgEnum.TOKEN_INVALID, codeEnum.BAD_REQUEST)
      );

    const user = await User.findById(decoded.id);

    if (!user)
      return next(
        new ErrorResponse(msgEnum.USER_NOT_FOUND, codeEnum.NOT_FOUND)
      );

    req.user = user;
    next();
  } catch (err) {
    console.log(err.message);
    return next(new ErrorResponse(msgEnum.UNAUTHORIZED, codeEnum.UNAUTHORIZED));
  }
});
