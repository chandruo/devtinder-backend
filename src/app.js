const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

connectDB()
  .then(() => {
    console.log("connection successful");
    app.listen(777, () => {
      console.log("server started running");
    });
  })
  .catch((err) => console.log(err));

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
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

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    res.status(200).json({
      message: "user found",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", error: err });
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return res.status(404).json({
        message: "No feed found",
      });
    }

    res.status(200).json({ users });
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});

app.delete("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(400).json({ message: "No user found" });
    }
    res.status(200).json({
      message: "user deleted successfully",
    });
  } catch (err) {
    res.status(500).json("something wrong");
  }
});

app.patch("/user", async (req, res) => {
  const { userId, ...data } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, data, { new: false });
    if (!user) {
      res.status(400).json({ message: "update failed" });
    }
    res.send("User details updated successfully");
  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
});
