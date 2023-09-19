const express = require("express");
const Router = express.Router();
const { protect } = require("../middleware/authMiddleware");
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
Router.route("/groupRemove").put(protect, removeFromGroupChat);
Router.route("/groupAdd").put(protect, addToGroupChat);

module.exports = Router;
