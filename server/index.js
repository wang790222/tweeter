"use strict";

// Basic express setup:

const express        = require("express");
const bodyParser     = require("body-parser");
require("dotenv").config();

const app            = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }

  const DataHelpers = require("./lib/data-helpers.js")(db);
  const userInfoHelpers = require("./lib/userInfo-helpers.js")(db);

  const userRoutes = require("./routes/userInfo")(userInfoHelpers);
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  app.use("/user", userRoutes);
  app.use("/tweets", tweetsRoutes);

  let port = process.env.PORT;
  if (port === null || port === "" || port === undefined) {
    port = 8080;
  }
  app.listen(port, () => {
    console.log("App listening on port " + port);
  });
});