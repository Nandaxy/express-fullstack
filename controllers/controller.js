
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

const addLike = async (req, res) => {
  if (!req.session.user) {
        return res.status(200).json({ code: 401, message: "Harap login terlebih dahulu." });
    }
  
    const { id } = req.query;
    
    try {
        const post = await Post.findById(id);
        
        if (!post) {
            return res.status(200).json({ code: 404, message: "Posting tidak ditemukan." });
        }
        
        const userId = req.session.user._id;

        const alreadyLiked = post.likes.some(like => like.user.toString() === userId.toString());
        if (alreadyLiked) {
            return res.status(200).json({ code: 400, message: "Anda sudah menyukai posting ini." });
        }
        
        post.likes.push({ user: userId, time: Date.now() });
        await post.save();
        
        res.status(200).json({ code: 200, message: "Like berhasil ditambahkan." });
    } catch (error) {
        console.error("Gagal menambahkan like:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat menambahkan like." });
    }
};

const removeLike = async (req, res) => {
    const { id } = req.query;
    
    try {
        const post = await Post.findById(id);
        
        if (!post) {
            return res.status(200).json({ code: 404, message: "Posting tidak ditemukan." });
        }
        
        const userId = req.session.user._id;

        const likedIndex = post.likes.findIndex(like => like.user.toString() === userId.toString());
        if (likedIndex === -1) {
            return res.status(200).json({ code: 400, message: "Anda belum menyukai posting ini." });
        }
        
        post.likes.splice(likedIndex, 1);
        await post.save();
        
        res.status(200).json({ code: 200, message: "Like berhasil dihapus." });
    } catch (error) {
        console.error("Gagal menghapus like:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat menghapus like." });
    }
};


module.exports = {
  createPost, addLike, removeLike,
};
