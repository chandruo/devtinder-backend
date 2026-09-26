const express = require("express");
const { auth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");
const connectionRequests = require("../models/connectionRequests");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  auth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      // allowed status code : interested , ignored
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `Invalid status type:${status}` });
      }

      // duplication check
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnection) {
        return res.status(400).json({ message: "request already exists" });
      }

      // random userId check
      const toUser = await User.findById({ _id: toUserId });

      if (!toUser) {
        return res.status(400).json({ message: "user nott found " });
      }

      const data = await connectionRequest.save();
      res.json({
        message: `${req.user.firstName} has ${status === "interested" ? "sent request to" : "ignored"} ${toUser.firstName}`,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  auth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const user = req.user;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status type" });
      }

      const connectionRequest = await connectionRequests.findOne({
        _id: requestId,
        toUserId: user._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(400).json({ message: "request not found" });
      }
      const fromUser = await User.findById({
        _id: connectionRequest.fromUserId,
      });

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(200).json({
        message: `${user.firstName} ${status} ${fromUser.firstName} `,
        data,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
);

module.exports = requestRouter;
