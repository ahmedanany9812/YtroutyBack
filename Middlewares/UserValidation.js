const User = require("../Models/UserModel");
const asyncHandler = require("express-async-handler");
const { compare } = require("bcryptjs");
const validations = {
  SignUpValidation: asyncHandler(async (req, res, next) => {
    let errors = [];
    const { username, email } = req.body;
    //If user is already exist
    const user = await User.findOne({ email });
    if (user) {
      errors.push("This Email already exist");
      return res.status(400).json({ errors });
    }
    //If username is used
    const usedname = await User.findOne({ username });
    if (usedname) {
      errors.push(`Sorry! , ${username} is Aleardy Used\n Try Another One`);
      return res.status(400).json({ errors });
    }
    next();
  }),
  LoginValidation: asyncHandler(async (req, res, next) => {
    let errors = [];
    const { email, password } = req.body;
    //If user is already exist
    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      errors.push("User does not exist");
      return res.status(400).json({ errors });
    }
    //verify the password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      errors.push("Password is incorrect");
      return res.status(400).json({ errors });
    }
    req.user = user;
    next();
  }),
};

module.exports = validations;
