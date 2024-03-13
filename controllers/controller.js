
const Post = require("../models/post");

const createPost = async (req, res) => {
  try {
    const createdBy = req.session.user._id;
    // console.log(createdBy);
    // console.log(req.session.user);

    const { post, privacy, comment } = req.body;

    console.log(post, privacy, comment)
    const newPost = new Post({
      createdBy: createdBy,
      content: post,
      privacy: privacy,
      enableComments: comment,
    });

    const savedPost = await newPost.save();

    
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat membuat postingan" });
  }
};

module.exports = {
  createPost,
};
