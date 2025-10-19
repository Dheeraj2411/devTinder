const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.send(user.firstName + "sent the connection reqest!");
});
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status check :" + status });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            toUserId: fromUserId,
            fromUserId: toUserId,
          },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(404)
          .json({ message: "connection request already exist" });
      }

      // if there is existing conmnection request
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not found" });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName + "is " + status + "in" + toUser.firstName,
        data,
      });
    } catch (err) {
      res.send("Error" + err.message);
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const allowedStatus = ["accepted", "rejected"];
      const { status, requestId } = req.params;
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Satus not allowed!" });
      }
      const connectionmRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      console.log(requestId, status);
      if (!connectionmRequest) {
        return res.status(404).json({
          message: "connection request not found",
        });
      }
      connectionmRequest.status = status;
      const data = await connectionmRequest.save();
      res.json({ message: "Connection request" + status, data });
    } catch (err) {
      res.status(400).send("Error" + err.message);
    }
  }
);

module.exports = requestRouter;
