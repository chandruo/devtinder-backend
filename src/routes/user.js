const express = require("express");

const userRouter = express.Router();
const { auth } = require("../middlewares/auth");
const connectionRequests = require("../models/connectionRequests");

const FIELDS = "firstName lastName  photoUrl";

userRouter.get("/requests/received", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log(loggedInUser);
    const users = await connectionRequests
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", ["firstName", "lastName"]);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/connections", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const users = await connectionRequests
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        status: "accepted",
      })
      .populate("fromUserId", FIELDS)
      .populate("toUserId", FIELDS);

    const data = users.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) return row.toUserId;
      return row.fromUserId;
    });
    res.status(200).json({data});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
