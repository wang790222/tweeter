"use strict";

const userHelper    = require("../lib/util/user-helper");
const cookieParser  = require('cookie-parser');
const express       = require('express');
const tweetsRoutes  = express.Router();

tweetsRoutes.use(cookieParser());

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {

    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const user = userHelper.generateRandomUser();
    if (req.cookies.user_id) {
      user.name = req.cookies.user_id;
      user.handle = `@${req.cookies.user_handle}`;
    }

    const tweet = {
      user: user,
      content: {
        text: req.body.text,
        likes: 0
      },
      created_at: Date.now()
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  tweetsRoutes.post("/like", function(res, req) {
    console.log("like!!!");
    /*
    DataHelpers.getTweetIsLiked(userName, text, (err, likedTweet) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        console.log(likedTweet);
      }
    });*/
  });

  return tweetsRoutes;

};
