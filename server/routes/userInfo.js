
const express       = require('express');
const usersRoutes   = express.Router();
const path          = require("path");
const bcrypt        = require('bcrypt');

module.exports = function(userInfoHelpers) {

  usersRoutes.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, "../../public", "login.html"));
  });

  usersRoutes.get("/register", function(req, res) {
    res.sendFile(path.join(__dirname, "../../public", "register.html"));
  });

  usersRoutes.get("/logout", function(req, res) {
    res.clearCookie("user_id");
    res.clearCookie("user_handle");
    res.status(201).redirect("/");
  });

  usersRoutes.post("/login", function(req, res) {

    userInfoHelpers.getUserInfo(req.body.email, (err, userInfo) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (req.body.email === "" || req.body.password === "" || userInfo.length === 0) {
          res.redirect("/loginError.html");
          return;
        }

        if (!bcrypt.compareSync(req.body.password, userInfo[0].password)) {
          res.redirect("/loginError.html");
          return;
        } else {
          res.cookie("user_id", userInfo[0].id);
          res.cookie("user_handle", userInfo[0].handle);
          res.redirect("/");
          return;
        }
      }
    });
  });

  usersRoutes.post("/register", function(req, res) {

    userInfoHelpers.getUserInfo(req.body.email, (err, userInfo) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (userInfo.length !== 0) {
          res.redirect("/registerError.html");
          return;
        }

        let newUserInfo = {
          id: req.body.email.split("@")[0],
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
          handle: req.body.handle
        };

        userInfoHelpers.saveUserInfo(newUserInfo, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.cookie("user_id", req.body.email.split("@")[0]);
            res.cookie("user_handle", req.body.handle);
            res.status(201).redirect("/");
          }
        });
      }
    });
  });

  return usersRoutes;
};
