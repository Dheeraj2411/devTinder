const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { ReturnDocument } = require("mongodb");
app.use(express.json());
const { validateSignUpData } = require("./utils/validator");
const bcrypt = require("bcrypt");

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const users = await User.findOne({ email: userEmail });
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
app.get("/userid", async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete(userId);
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
      x;
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.post("/signup", async (req, res) => {
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

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const firstName = req.body.firstName;
  console.log(userId);
  try {
    const users = await User.findByIdAndUpdate(userId, firstName, {
      ReturnDocument: "after",
      runValidators: true,
    });
    res.send(users);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login Sucessfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(402).send("Error :" + err.message);
  }
});
connectDB()
  .then(() => {
    console.log("database connection established...");
    app.listen(7777, () => {
      console.log("Server running on port number 7777 ");
    });
  })
  .catch((err) => {
    console.error("database cannot be connected");
  });
