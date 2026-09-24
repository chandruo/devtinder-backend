const express = require("express")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { auth } = require("../middlewares/auth");

const authRouter = express.Router()

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, age, emailId, password } = req.body;

    const hashpassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      age,
      emailId,
      password: hashpassword,
    });

    await user.save();
    res.status(201).json({
      message: "user created successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
      error: err,
    });
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId }).select("+password");

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, "JWT_SECRET", {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000,
    });
    const userRes = {
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age
    }

    res.status(200).json({
      message: "Login successfull",
      userRes
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

authRouter.get("/profile", auth, async (req, res) => {
  const userDetials = req.user;
  res.status(200).json({
    userDetials,
  });
});

module.exports = authRouter