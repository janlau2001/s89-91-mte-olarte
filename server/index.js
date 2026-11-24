require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blogApp",
);

let db = mongoose.connection;

db.on("error", () => console.log("Database connection error"));
db.once("open", () => console.log("Database connected successfully"));

// Routes Middleware
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

// Response handling for unknown routes and unexpected errors
app.use((req, res) => {
  res.status(404).send({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).send({ error: "Invalid JSON body" });
  }
  console.error("Unhandled error:", err);
  res.status(500).send({ error: "Internal server error" });
});

if (require.main === module) {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`API is now online on port ${process.env.PORT || 4000}`);
  });
}

module.exports = { app, mongoose };
