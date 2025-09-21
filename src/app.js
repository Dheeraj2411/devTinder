const express = require("express");
const app = express();
app.use("/test", (req, res) => {
  res.send("Hello world from server");
});
app.listen(7777, () => {
  console.log("SERVER SUCCESSFULLY run on port number 77777");
});
