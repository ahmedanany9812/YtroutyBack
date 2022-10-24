const { model, Schema } = require("mongoose");
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    avatar: {
      url: {
        default:
          "https://res.cloudinary.com/drsodrtuf/image/upload/v1664099749/avatars/xssqfcufurctfkopsruy.jpg",
        type: String,
      },
      avatarid: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
    collection: "Users",
  }
);

const User = model("User", userSchema);
module.exports = User;
