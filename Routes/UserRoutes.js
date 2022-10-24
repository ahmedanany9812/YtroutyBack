const express = require("express");
const Urouter = express.Router();
const {
  SignUp,
  SignIn,
  GetAccess,
  AccessRefresh,
  LogOut,
  UpdateStats,
  deleteuser,
  getusers,
  ProfilePosts,
  getuserStats,
} = require("../Controllers/UserController");
const verifyAccess = require("../Middlewares/Authorization");
const upload = require("../Middlewares/AvatarMulter");
const {
  ValidateSignUp,
  ValidateSignIn,
  Validate,
} = require("../Middlewares/InputsValidations");
const {
  SignUpValidation,
  LoginValidation,
} = require("../Middlewares/UserValidation");
Urouter.route("/profile/:userId").get(verifyAccess, ProfilePosts);
Urouter.route("/Register").post(
  ValidateSignUp,
  Validate,
  SignUpValidation,
  SignUp
);
Urouter.route("/SignIn").post(
  ValidateSignIn,
  Validate,
  LoginValidation,
  SignIn
);
Urouter.route("/user").get(verifyAccess, GetAccess);
Urouter.route("/refresh").get(AccessRefresh, verifyAccess, GetAccess);
Urouter.route("/logout").post(verifyAccess, LogOut);
Urouter.route("/deleteAccount").delete(verifyAccess, deleteuser);
Urouter.route("/update").put(
  verifyAccess,
  upload.single("avatarImage"),
  UpdateStats
);
Urouter.route("/").get(verifyAccess, getusers);
Urouter.route("/:userId").get(verifyAccess, getuserStats);
module.exports = Urouter;
