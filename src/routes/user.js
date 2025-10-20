const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRoute = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName age gender ";

userRoute.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser?._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetch Successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error" + err.message);
    console.log(err);
  }
});

userRoute.get("/user/connection", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  try {
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString === loggedInUser._id.toString) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});
module.exports = userRoute;
