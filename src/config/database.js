const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dheerajjha:RYfHCK4b0VVeziV5@namastenode.usyvkc6.mongodb.net/devTinder"
  );
};
module.exports = connectDB;
