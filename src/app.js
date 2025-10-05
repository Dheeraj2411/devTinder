const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { ReturnDocument } = require("mongodb");
app.use(express.json());

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
  const users = new User(req.body);
  await users.save();
  res.send("data submitted successfully");
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const firstName = req.body.firstName;
  try {
    const users = await User.findByIdAndUpdate(userId, firstName, {
      ReturnDocument: "after",
      runValidators: true,
    });
    res.send(users);
  } catch (err) {
    res.status(404).send("user not found");
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
