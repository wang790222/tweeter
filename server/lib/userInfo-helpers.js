

module.exports = function makeUserInfoHelpers(db) {

  return {
    saveUserInfo: function(userInfo, callback) {
      db.collection("userInfo").insertOne(userInfo);
      callback(null, true);
    },

    getUserInfo: function(email, callback) {
      let target = {email: email};
      db.collection("userInfo").find(target).toArray(callback);
    }
  };
};