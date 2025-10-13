const express = require("express");
const authRouter = express.Router();

const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validator");

authRouter.post("/signup", async (req, res) => {
  // console.log(req.body);
  try {
    validateSignUpData(req);
    // validators
    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const users = new User({
      firstName,
      lastName,
      email,
      age,
      gender,
      password: passwordHash,
    });
    if (!users) {
      throw new Error("Duplicate email id or password ");
    }

    // encription password

    await users.save();
    res.send("Data submitted successfully");
  } catch (err) {
    res.status(404).send("ERROR : Dublicate email or password");
    console.log(err);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
        httpsOnly: true,
      });
      res.send("Login Sucessfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(404).send("Error :" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout Successfully");
});

module.exports = authRouter;
