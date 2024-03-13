const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  privacy: {
    type: String,
  },
  enableComments: {
    type: Boolean,
  },
  createdBy: {
    type: String,
    ref: "Users",
  },

  imageUrls: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comment: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
