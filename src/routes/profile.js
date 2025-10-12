const express = require("express");
const routeRequest = express.Router();
const { userAuth } = require("../middlewares/auth");

routeRequest.get("/profile", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(404).send("Error :" + err.message);
  }
});

module.exports = routeRequest;
