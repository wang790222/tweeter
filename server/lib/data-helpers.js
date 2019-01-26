"use strict";

module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").find().toArray(callback);
    },

    updateTweet: function(isLike, userName, timestamp, callback) {

      let target = {"user.name": userName, "created_at": Number(timestamp)};

      (Number(isLike) === 1 ) ? db.collection("tweets").update(target, {$inc: {"content.likes": 1}}) :
      db.collection("tweets").update(target, {$inc: {"content.likes": -1}});
      callback(null, true);
    }
  };
};
