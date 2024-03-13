const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const { createPost } = require('../controllers/controller');


const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
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
    // console.log(isSelfProfile)
    // console.log(loggedIn)
    // console.log(loggedInUser)
    res.render("profile", { user, loggedIn, loggedInUser, isSelfProfile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil profil pengguna.");
  }
});

router.post('/create-post', createPost);

router.get("/p/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).send("Posting tidak ditemukan.");
    }

    const loggedInUser = req.session.user;
    const isSelfPost = loggedInUser && loggedInUser.id === post.createdBy;
    const loggedIn = req.session.user ? true : false;


    const userPost = await User.findById(post.createdBy);

    console.log(userPost);

    res.render("postDetail", { post, loggedIn, loggedInUser, isSelfPost, userPost });
  } catch (error) {
    console.error("Error fetching post detail:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil detail posting.");
  }
});


module.exports = router;
