const express = require("express");
const Prouter = express.Router();
const uploadMedia = require("../Middlewares/MediaMulter");
const {
  AddPost,
  AddComment,
  deleteComment,
  likePost,
  deletePost,
  likeComment,
  getAllPosts,
} = require("../Controllers/PostController");
const verifyAccess = require("../Middlewares/Authorization");
const {
  Validate,
  Validatecomments,
} = require("../Middlewares/InputsValidations");

Prouter.route("/").get(verifyAccess, getAllPosts);
Prouter.route("/").post(
  verifyAccess,
  uploadMedia,
  AddPost
);
Prouter.route("/:postId").delete(verifyAccess, deletePost);
Prouter.route("/like/:postId").post(verifyAccess, likePost);
Prouter.route("/comment/:postId").post(
  verifyAccess,
  Validatecomments,
  Validate,
  AddComment
);
Prouter.route("/comment/:postId/:commentId").delete(
  verifyAccess,
  deleteComment
);
Prouter.route("/comment/:postId/:commentId").post(verifyAccess, likeComment);

module.exports = Prouter;
