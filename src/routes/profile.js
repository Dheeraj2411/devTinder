const express = require("express");
const routeRequest = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateRditProfileData } = require("../utils/validator");
const validator = require("validator");
const bcrypt = require("bcrypt");

routeRequest.get("/profile/view", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(404).send("Error :" + err.message);
  }
});
routeRequest.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateRditProfileData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;
    Object?.keys(req.body).forEach(
      (key) => (loggedInUser[key] = req?.body[key])
    );

    await loggedInUser.save();
    res.json({
      message: ` ${loggedInUser.firstName} profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

routeRequest.patch("/profile/update-password", userAuth, async (req, res) => {
  const { password } = req?.body;
  const user = req?.user;

  try {
    if (!validator?.isStrongPassword(password)) {
      throw new Error("Enter Strong Password");
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.send("password update successfully");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

module.exports = routeRequest;


