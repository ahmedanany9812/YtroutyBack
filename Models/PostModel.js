const { Schema, model } = require("mongoose");
const PostsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    userAvatar: {
      type: String,
      ref: "users",
    },
    username: {
      type: String,
      ref: "users",
    },
    body: {
      type: String,
    },
    likes: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
        username: {
          type: String,
          ref: "users",
        },
      },
    ],
    comments: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
        userAvatar: {
          type: String,
          ref: "users",
        },
        username: {
          type: String,
          ref: "users",
        },
        body: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        likes: [
          {
            userId: {
              type: Schema.Types.ObjectId,
              ref: "users",
            },
            username: {
              type: String,
              ref: "users",
            },
          },
        ],
      },
    ],
    media: {
      photo: {
        photoID: String,
        url: String,
      },
      video: {
        videoID: String,
        url: String,
      },
    },
  },

  {
    timestamps: true,
    collection: "Posts",
  }
);

const Post = model("Posts", PostsSchema);

module.exports = Post;
