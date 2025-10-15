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

// const express = require("express");
// const router = express.Router();
// const User = require("../models/User"); // Assuming your User model is in ../models/User
// const bcrypt = require("bcryptjs"); // Or 'bcrypt'

// router.patch("/update-password/:id", async (req, res) => {
//   const { oldPassword, newPassword } = req.body;
//   const userId = req.params.id;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Verify old password (if applicable)
//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Incorrect old password" });
//     }

//     // Hash the new password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);

//     // Save the updated user
//     await user.save();

//     res.status(200).json({ message: "Password updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
