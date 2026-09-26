const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieparser = require("cookie-parser");
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/connectionRequest");
const userRouter = require("./routes/user");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:777",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieparser());

connectDB()
  .then(() => {
    console.log("connection successful");
    app.listen(777, () => {
      console.log("server started running");
    });
  })
  .catch((err) => console.log(err));

app.use("/auth", authRouter);
app.use("/", requestRouter);
app.use("/user", userRouter);

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
