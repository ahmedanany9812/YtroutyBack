const express = require("express");
require("dotenv").config({ path: "./config.env" });
const app = express();
const { connect } = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const port = process.env.PORT;
const Urouter = require("./Routes/UserRoutes");
const Prouter = require("./Routes/PostRoutes");

//middlewares

// 1- read the body data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://ytrouty.onrender.com",
    credentials: true,
  })
);
//2- Read the cookie that was send to the server
app.use(cookieParser());
//connect to mongoDB
const ConnectDB = async () => {
  try {
    connect(process.env.MONGO_URI, () => {
      console.log("Connected To Database");
    });
  } catch (err) {
    console.log(err);
  }
};

//call DB connection function
ConnectDB();

//Add routes to our App contains controllers
app.use("/users", Urouter);
app.use("/posts", Prouter);
//Run Server
app.listen(port, () => {
  console.log(`App running Successfully on PORT ${port}`);
});
