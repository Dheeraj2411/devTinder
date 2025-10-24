const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRoute = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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
    console.log(connectionRequests);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

userRoute.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = limit > 50 ? 50 : limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
      // add user in string who had present in req list or interested list and frnf list
    });

    const users = await User.find({
      $and: [
        // and
        {
          _id: { $nin: Array.from(hideUserFromFeed) },
        },
        // not in return multiple value
        {
          _id: { $ne: loggedInUser._id },
        },
        // not equal return single value
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRoute;
