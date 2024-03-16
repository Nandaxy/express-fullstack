const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const { createPost, addLike, removeLike } = require("../controllers/controller");

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

const checkAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Anda belum login." });
    }
    next();
};


router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/home");
  }
  res.render("login");
});

router.get("/home", requireLogin, (req, res) => {
  const loggedInUser = req.session.user;
  const loggedIn = req.session.user ? true : false;

  res.render("home", { loggedIn, loggedInUser });
});

router.get("/create", requireLogin, (req, res) => {
  const loggedInUser = req.session.user;
  const loggedIn = req.session.user ? true : false;

  res.render("CreatePost", { loggedIn, loggedInUser });
});

router.get("/@:namauser", async (req, res) => {
  try {
    const { namauser } = req.params;
    const user = await User.findOne({ username: namauser });

    if (!user) {
      return res.status(404).send("Profil tidak ditemukan.");
    }

    const loggedInUser = req.session.user;
    const isSelfProfile = loggedInUser && loggedInUser.username === namauser;
    const loggedIn = req.session.user ? true : false;

    const createdBy = user._id;
    const post = await Post.find({ createdBy });
    // console.log(posts);
    // console.log(posts)
    
    res.render("profile", {
      user,
      loggedIn,
      loggedInUser,
      isSelfProfile,
      post,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil profil pengguna.");
  }
});

router.get("/p/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).send("Posting tidak ditemukan.");
        }

        const loggedInUser = req.session.user;
        const isSelfPost = loggedInUser && loggedInUser._id === post.createdBy;
        const loggedIn = req.session.user ? true : false;
        const userPost = await User.findById(post.createdBy);

        if (post.privacy === "private" && !isSelfPost) {
            return res.status(403).send("Postingan ini di Private");
        }

        // Mengecek apakah pengguna saat ini sudah login dan menambahkan isLiked ke data yang akan dirender
        let isLiked = false;
        if (loggedInUser) {
            isLiked = post.likes.some(like => like.user.toString() === loggedInUser._id.toString());
        }

        // Mendapatkan daftar pengguna yang sudah meng-like
        const likedUsers = await User.find({ _id: { $in: post.likes.map(like => like.user) } });

        // Mengambil username dan gambar profil dari daftar pengguna yang sudah meng-like
        const likedUserData = likedUsers.map(user => ({
            username: user.username,
            profilePicture: user.profilePicture // Menambahkan properti profilePicture
        }));

        console.log("Pengguna yang sudah meng-like:", likedUserData);

        res.render("postDetail", {
            post,
            loggedIn,
            loggedInUser,
            isSelfPost,
            userPost,
            isLiked,
            likedUserData // Melewatkan informasi pengguna yang telah memberikan like ke templat
        });
    } catch (error) {
        console.error("Error fetching post detail:", error);
        res.status(500).send("Terjadi kesalahan saat mengambil detail posting.");
    }
});




// rute post
router.post("/create-post", createPost);

router.post("/feature/add-like", addLike, checkAuth);

router.post("/feature/dislike", removeLike, checkAuth);

module.exports = router;
