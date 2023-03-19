const express = require("express");
const router = express();

const {
  register,
  signIn,
  forgot,
  resetPassword,
  updatePassword,
  updateDetails,
  getMe,
  getToken,
} = require("../controllers/auth.controller");

const { protect, verifyRefreshToken } = require("../middleware/auth");

const { apiEnum } = require("../enum/api.enum");

router
  .get(apiEnum.API_GET_MY_PROFILE, protect, getMe)
  .post(apiEnum.API_GET_TOKEN, verifyRefreshToken, getToken)
  .post(apiEnum.API_REGISTER, register)
  .post(apiEnum.API_LOGIN, signIn)
  .post(apiEnum.API_FORGOT_PASSWORD, forgot)
  .put(apiEnum.API_RESET_PASSWORD, resetPassword)
  .put(apiEnum.API_UPDATE_PASSWORD, protect, updatePassword)
  .put(apiEnum.API_UPDATE_PROFILE, protect, updateDetails);

module.exports = router;
