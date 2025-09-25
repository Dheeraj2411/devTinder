const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  res.send({ FirstName: "Dheeraj", lastName: "Jha" });
});
app.post("/user", (req, res) => {
  res.send("Data saved successfully");
});

app.delete("/user", (req, res) => {
  res.send("User data successfully deleted");
});
app.use("/test", (req, res) => {
  res.send("Hello world from server");
});
app.listen(7777, () => {
  console.log("SERVER SUCCESSFULLY run on port number 77777");
});
