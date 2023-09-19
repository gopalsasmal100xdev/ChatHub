const express = require("express");
const Router = express.Router();
const { protect, onlyAdmin } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroupChat,
  addToGroupChat,
  renameGroupChat,
} = require("../controller/Chat.controller");

Router.route("/").get(protect, fetchChats).post(protect, accessChat);
Router.route("/group").post(protect, createGroupChat);
Router.route("/rename").put(protect, renameGroupChat);
// only admin can access this routes
Router.route("/groupRemove").put(protect, onlyAdmin, removeFromGroupChat);
Router.route("/addMemberInGroup").put(protect, onlyAdmin, addToGroupChat);

module.exports = Router;
