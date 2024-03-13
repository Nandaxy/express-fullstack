const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const saltRounds = 10;
const allowedCharacters = /^[a-zA-Z0-9\s!_\-;,.\?\/=+]+$/;

router.post("/register", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    username = username.trim();
    email = email.trim();
    password = password.trim();

    if (username.length > 30 || email.length > 60 || password.length > 100) {
      return res.status(200).json({
        status: false,
        message:
          "Username maksimal 30 karakter, email  60, dan password maksimal 100 karakter",
      });
    }

    if (!allowedCharacters.test(username)) {
      return res.status(200).json({
        status: false,
        message: "Username tidak tersedia",
      });
    }

    if (!username || !email || !password) {
      return res
        .status(200)
        .json({ status: false, message: "Mohon isi semua kolom." });
    }

    if (password.length < 4) {
      return res
        .status(200)
        .json({ status: false, message: "Password minimal 4 karakter." });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(200)
        .json({
          status: false,
          message: "Username atau email sudah digunakan.",
        });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(201)
      .json({ status: true, message: "Pengguna berhasil didaftarkan." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        status: false,
        message: "Terjadi kesalahan saat mendaftarkan pengguna.",
      });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ message: "Mohon isi semua kolom." });
    }

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      return res.status(401).json({ message: "E-mail atau password salah." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "E-mail atau password salah." });
    }

    user.lastLogin = new Date();
    await user.save();

    req.session.user = user;

    res.status(200).json({ message: "Login berhasil." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan saat login." });
  }
});

router.post("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ status: false, message: "Failed to logout." });
      }
      res.status(200).json({ status: true, message: "Logout successful." });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ status: false, message: "Failed to logout." });
  }
});


module.exports = router;
