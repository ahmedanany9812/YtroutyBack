const Post = require("../Models/PostModel");
const User = require("../Models/UserModel");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../Middlewares/Cloudinary");
const controllers = {
  AddPost: asyncHandler(async (req, res) => {
    let errors = [];
    const result =
      req.file &&
      (await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "media",
        chunk_size: 6000000,
      }));
    const { userId } = req.user;
    const user = await User.findById(userId);
    const { body } = req.body;

    if (!req.file && !body) {
      errors.push("The Post is empty");
      return res.status(400).json({ errors });
    }
    const post = await Post.create({
      userId: userId,
      userAvatar: user.avatar.url,
      username: user.username,
      body,
      media: {
        photo: req.file
          ? result.resource_type == "image"
            ? {
                photoID: result.public_id,
                url: result.secure_url,
              }
            : null
          : null,
        video: req.file
          ? result.resource_type == "video"
            ? {
                videoID: result.public_id,
                url: result.secure_url,
              }
            : null
          : null,
      },
    });
    return res.status(200).json({ post });
  }),
  AddComment: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findById(userId);
    const { postId } = req.params;
    const { body } = req.body;
    const post = await Post.findById(postId);
    post.comments.push({
      userId: userId,
      userAvatar: user.avatar.url,
      username: user.username,
      body,
    });
    await post.save();
    return res.status(200).json({ post });
  }),
  deleteComment: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    if (!comment) {
      return res.json({ msg: "comment not found" });
    }
    if (comment.userId.toString() !== userId) {
      return res.json({
        msg: "sir you are not allowed to delete this comment",
      });
    }
    post.comments.pull(comment);
    await post.save();
    return res.status(200).json({ post });
  }),
  deletePost: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { postId } = req.params;
    const post = await Post.findById(postId);
    const photo = post.media.photo && post.media.photo.photoID;
    const video = post.media.video && post.media.video.videoID;
    if (photo) {
      await cloudinary.uploader.destroy(photo);
    }
    if (video) {
      await cloudinary.uploader.destroy(video, {
        resource_type: "video",
      });
    }
    if (post.userId.toString() !== userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    post.remove();
    return res.status(200).json({ msg: "Post deleted" });
  }),
  likePost: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findById(userId);
    const { postId } = req.params;
    const post = await Post.findById(postId);
    const IsLiked = post.likes.find(
      (like) => like.userId.toString() === userId
    );
    if (IsLiked) {
      post.likes = post.likes.filter(
        (like) => like.userId.toString() !== userId
      );
      await post.save();
      return res.status(200).json({ msg: "Post unliked", post });
    } else {
      post.likes.push({
        userId: userId,
        username: user.username,
      });
      await post.save();
      return res.status(200).json({ post });
    }
  }),

  likeComment: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findById(userId);
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    const comment = post.comments.find(
      (one) => one._id.toString() === commentId
    );
    const IsLiked = comment.likes.find(
      (like) => like.userId.toString() === userId
    );
    if (IsLiked) {
      comment.likes = comment.likes.filter(
        (like) => like.userId.toString() !== userId
      );
      await post.save();
      return res.status(200).json({ msg: "comment unliked", comment });
    } else {
      comment.likes.push({
        userId: userId,
        username: user.username,
      });
      await post.save();
      return res.status(200).json({ comment });
    }
  }),
  getAllPosts: asyncHandler(async (req, res) => {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ posts });
  }),
};
module.exports = controllers;
