const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const connectDB = require("./config/dbconnection");
const getSitesRouter = require("./routes/sites_route.js");

// Connect to MongoDB
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// Define routes
app.use("/api", getSitesRouter);
app.get("/", (req, res) => {
  res.send("API is running...");
});
