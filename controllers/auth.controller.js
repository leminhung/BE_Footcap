const crypto = require("crypto");

const User = require("../models/User.model");
const Coupon = require("../models/Coupon.model");
const Product = require("../models/Product.model");

const asyncHandler = require("../middleware/async");

const ErrorResponse = require("../utils/ErrorResponse");
const sendMail = require("../utils/sendMail");

const { codeEnum } = require("../enum/status-code.enum");
const { msgEnum } = require("../enum/message.enum");

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return next(new ErrorResponse(msgEnum.USER_NOT_FOUND, codeEnum.NOT_FOUND));
  }

  let user = await User.findOne({ email });

  if (user)
    return next(new ErrorResponse(msgEnum.USER_EXIST, codeEnum.BAD_REQUEST));

  user = await User.create({ name, email, password });

  const token = user.signToken();

  res.status(codeEnum.SUCCESS).json({ token });
});

// @desc      Login user
// @route     GET /api/v1/auth/login
// @access    Public
exports.signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse(msgEnum.USER_NOT_FOUND, codeEnum.NOT_FOUND));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse(msgEnum.USER_NOT_FOUND, codeEnum.NOT_FOUND));
  }

  const checkMatch = await user.isMatchPassword(password);
  if (!checkMatch) {
    return next(
      new ErrorResponse(msgEnum.WRONG_PASSWORD, codeEnum.UNAUTHORIZED)
    );
  }

  const token = user.signToken();
  const refreshToken = await user.signRefreshToken();

  res.status(codeEnum.SUCCESS).json({ token, refreshToken, actor: user });
});

// @desc      SignOut user
// @route     GET /api/v1/auth/logout
// @access    Public
exports.signOut = asyncHandler(async (req, res, next) => {
  const token = undefined;
  const refreshToken = undefined;

  res.status(codeEnum.SUCCESS).json({ token, refreshToken });
});

// @desc      Forgot password
// @route     GET /api/v1/auth/forgot
// @access    Public
exports.forgot = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorResponse(USER_NOT_FOUND, codeEnum.NOT_FOUND));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse(msgEnum.UNAUTHORIZED, codeEnum.UNAUTHORIZED));
  }

  //  Get reset token
  const resetToken = await user.getResetpasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `Vui lòng click vào đây ${resetUrl} để cập nhật lại mật khẩu. 
      Link tồn tại trong ${process.env.RESET_TOKEN_EXPIRE} phút.`;

  const options = {
    email: user.email,
    subject: "Quên mật khẩu ?",
    message,
  };

  await sendMail(options);

  res.status(codeEnum.SUCCESS).json({
    msg: msgEnum.MAIL_SENT,
  });
});

// @desc      Reset password
// @route     GET /api/v1/auth/resetpassword
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.reset - token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse(TOKEN_INVALID, 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = user.signToken();

  res.status(codeEnum.SUCCESS).json({ token });
});

// @desc      Reset password
// @route     GET /api/v1/auth/resetpassword
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.reset - token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse(msgEnum.TOKEN_INVALID, 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = user.signToken();

  res.status(codeEnum.SUCCESS).json({ token });
});

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { newPassword, currentPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  const checkMatch = await user.isMatchPassword(currentPassword);
  if (!checkMatch) {
    return next(new ErrorResponse(msgEnum.WRONG_PASSWORD, codeEnum.NOT_FOUND));
  }

  user.password = newPassword;
  await user.save();

  const token = user.signToken();

  res.status(codeEnum.SUCCESS).json({ token });
});

// @desc      Update details user
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    email: req.body.email,
    name: req.body.name,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(codeEnum.SUCCESS).json({ data: user });
});

// @desc      Get current login user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(codeEnum.SUCCESS).json({ data: user });
});

// @desc      Get generate token
// @route     GET /api/v1/auth/token
// @access    Private
exports.getToken = asyncHandler(async (req, res, next) => {
  const token = req.user.signToken();
  res.status(codeEnum.SUCCESS).json({ token });
});

// @desc      Get all users
// @route     GET /api/v1/auth/getallusers
// @access    Private(Admin)
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(codeEnum.SUCCESS).json({ data: users });
});

// @desc      Get user
// @route     GET /api/v1/auth/getuser/:userId
// @access    Private(Admin)
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  res.status(codeEnum.SUCCESS).json({ data: user });
});

// @desc      Update details user by admin
// @route     PUT /api/v1/auth/updateuserdetails/:userId
// @access    Private(Admin)
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.userId, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(codeEnum.SUCCESS).json({ data: user });
});

// @desc      Delete user
// @route     DELETE /api/v1/auth/deleteuser/:userId
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  user.remove();

  res.status(codeEnum.SUCCESS).json({ data: {} });
});
