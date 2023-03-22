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
  signOut,
  getAllUsers,
  getUser,
  updateUserDetails,
  deleteUser,
} = require("../controllers/auth.controller");

const {
  protect,
  verifyRefreshToken,
  authorize,
} = require("../middleware/auth");

const { apiEnum } = require("../enum/api.enum");

router
  .get(apiEnum.API_GET_MY_PROFILE, protect, getMe)
  .get(apiEnum.API_GET_ALL_USERS, protect, authorize("admin"), getAllUsers)
  .get(apiEnum.API_GET_USER, protect, authorize("admin"), getUser)
  .get(apiEnum.API_SIGNOUT, signOut)
  .post(apiEnum.API_GET_TOKEN, verifyRefreshToken, getToken)
  .post(apiEnum.API_REGISTER, register)
  .post(apiEnum.API_LOGIN, signIn)
  .post(apiEnum.API_FORGOT_PASSWORD, forgot)
  .put(apiEnum.API_RESET_PASSWORD, resetPassword)
  .put(apiEnum.API_UPDATE_PASSWORD, protect, updatePassword)
  .put(apiEnum.API_UPDATE_PROFILE, protect, updateDetails)
  .put(
    apiEnum.API_UPDATE_USER_BY_ADMIN,
    protect,
    authorize("admin"),
    updateUserDetails
  )
  .delete(apiEnum.API_DELETE_USER, protect, authorize("admin"), deleteUser);

module.exports = router;
