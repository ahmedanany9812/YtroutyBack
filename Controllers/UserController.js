const User = require("../Models/UserModel");
const Post = require("../Models/PostModel");
const asyncHandler = require("express-async-handler");
const { sign, verify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const cloudinary = require("../Middlewares/Cloudinary");
const Ucontroller = {
  SignUp: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    //Hash the password
    const hashedPassword = await hash(password, 12);
    //Create a new user
    const NewUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    //Create and assign a token
    const token = sign({ userId: NewUser._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "15s",
    });
    res.cookie("Access-token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + +1000 * 15),
      sameSite: "none",
      secure: process.env.NODE_ENV,
    });
    return res.json({ msg: "User Created" });
  }),
  SignIn: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = req.user;
    //Create and assign a token
    const token = sign({ userId: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "15s",
    });
    res.cookie("Access-token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + +1000 * 15),
      sameSite: "none",
      secure: process.env.NODE_ENV,
    });
    return res.json({ msg: " user Logged in successfully " });
  }),
  GetAccess: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findById(userId);
    return res.json({
      username: user.username,
      avatar: user.avatar.url,
      isAdmin: user.isAdmin,
      id: user._id,
      email: user.email,
    });
  }),
  AccessRefresh: asyncHandler(async (req, res, next) => {
    const cookie = req.cookies["Access-token"];
    if (!cookie) {
      return res.status(401).json({ msg: "No Cookies" });
    }
    const user = verify(cookie, process.env.ACCESS_TOKEN);
    const { userId } = user;
    const newToken = sign({ userId }, process.env.ACCESS_TOKEN, {
      expiresIn: "15m",
    });
    res.cookie("Access-token", newToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 15),
      sameSite: "none",
      secure: process.env.NODE_ENV,
    });
    req.user = user;
    next();
  }),
  LogOut: asyncHandler(async (req, res) => {
    res.clearCookie("Access-token");
    return res.json({
      msg: "Logged Out",
    });
  }),
  UpdateStats: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    let errors = [];
    const user = await User.findById(userId);
    const { newPassword, newUsername, confirmpass } = req.body;
    if (newPassword) {
      if (newPassword.trim().length <= 8) {
        errors.push("Password must be at least 8 characters long");
        return res.status(400).json({ errors });
      }
      const oldPass = await compare(newPassword, user.password);
      if (oldPass) {
        errors.push("Thats already your password");
        return res.status(400).json({ errors });
      }
      if (newPassword !== confirmpass) {
        errors.push("Passwords inputs ain't the same");
        return res.status(400).json({ errors });
      }
    }
    if (newUsername) {
      if (newUsername.trim().length <= 3) {
        errors.push("Username must be at least 3 characters long");
        return res.status(400).json({ errors });
      }
      if (newUsername === user.username) {
        errors.push("Thats already your username");
        return res.status(400).json({ errors });
      }
    }
    const oldpic = req.file && user.avatar.avatarid;
    if (oldpic) {
      await cloudinary.uploader.destroy(oldpic);
    }
    const result =
      req.file &&
      (await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      }));
    user.password = newPassword ? await hash(newPassword, 12) : user.password;
    user.username = newUsername ? newUsername : user.username;
    user.avatar.url = req.file ? result.secure_url : user.avatar.url;
    user.avatar.avatarid = req.file ? result.public_id : user.avatar.avatarid;
    await user.save();
    await Post.updateMany(
      { userId: userId },
      {
        $set: {
          username: newUsername ? newUsername : user.username,
          userAvatar: req.file ? result.secure_url : user.avatar.url,
        },
      }
    );
    await Post.updateMany(
      { "comments.userId": userId },
      {
        $set: {
          "comments.$[].username": newUsername ? newUsername : user.username,
          "comments.$[].userAvatar": req.file
            ? result.secure_url
            : user.avatar.url,
        },
      }
    );
    await Post.updateMany(
      {
        "comments.likes.userId": userId,
      },
      {
        $set: {
          "comments.$[].likes.$[].username": newUsername
            ? newUsername
            : user.username,
        },
      }
    );

    await Post.updateMany(
      { "likes.userId": userId },
      {
        $set: {
          "likes.$[].username": newUsername ? newUsername : user.username,
        },
      }
    );
    return res.json({
      username: user.username,
      avatar: user.avatar.url,
      isAdmin: user.isAdmin,
      id: user._id,
      email: user.email,
    });
  }),
  deleteuser: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    await Post.deleteMany({ userId: userId });
    await Post.deleteMany({ "comments.userId": userId });
    await Post.deleteMany({ "likes.userId": userId });
    await Post.deleteMany({
      "comments.likes.userId": userId,
    });
    await User.findByIdAndDelete(userId);
    res.clearCookie("Access-token");
    return res.status(200).json({ msg: "user deleted succesfully" });
  }),
  getusers: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const AllUsers = await User.find({});
    const users = AllUsers.filter((user) => {
      return user._id.toString() !== userId;
    });
    return res.json({ users });
  }),
  getuserStats: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const userPosts = await Post.find({ userId: userId });
    const likedPosts = userPosts.filter((post) => post.likes.length > 0);
    const Comments = await Post.find({ "comments.userId": userId });
    return res.json({
      userPosts: userPosts.length,
      likedPosts: likedPosts.length,
      Comments: Comments.length,
      username: user.username,
      avatar: user.avatar.url,
      id:user._id
    });
  }),
  ProfilePosts: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const userPosts = await Post.find({ userId: userId });
    return res.json({
      userPosts,
    });
  }),
};

module.exports = Ucontroller;
