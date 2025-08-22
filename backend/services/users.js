const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/users.js");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName = "", email, password, profileUrl = "" } = req.body || {};
    if (!email || !password || !fullName)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const exists = await User.findOne({ email }).lean();
    if (exists)
      return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      profileUrl,
      isOnline: false,
    });

    return res.json({
      id: String(user._id),
      fullName: user.fullName,
      email: user.email,
      profileUrl: user.profileUrl,
      isOnline: user.isOnline,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Internal error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    user.isOnline = true;
    await user.save();

    return res.json({
      id: String(user._id),
      fullName: user.fullName,
      email: user.email,
      profileUrl: user.profileUrl,
      isOnline: user.isOnline,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, profileUrl, password } = req.body || {};

    const update = {};
    update.fullName = fullName;
    update.profileUrl = profileUrl;
    if (password.length > 0) {
      update.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      id: String(user._id),
      fullName: user.fullName,
      email: user.email,
      profileUrl: user.profileUrl,
      isOnline: user.isOnline,
    });
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({ message: "Internal error" });
  }
});

module.exports = router;
