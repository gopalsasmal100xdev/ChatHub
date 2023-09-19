const express = require("express");
const Router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { allUsers } = require("../controller/users.controller");
const { registerUser, loginUser } = require("../controller/Auth.controller");

/**
 * @dev route map
 * '/api/' get request for all users
 * '/api/user/login' login user
 *  '/api/user/signup' register user
 */

Router.route("/").get(protect, allUsers);
Router.route("/user/login")
  .get((req, res) => {
    res.json({ msg: "Login get Route success" });
  })
  .post(loginUser);
Router.route("/user/signup")
  .get((req, res) => {
    res.json({ msg: "Success" });
  })
  .post(registerUser);

module.exports = Router;
