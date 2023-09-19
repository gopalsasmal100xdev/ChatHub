const asyncHandler = require("express-async-handler");

const fetchChats = asyncHandler(async (req, res) => {});
const accessChat = asyncHandler(async (req, res) => {});
const createGroupChat = asyncHandler(async (req, res) => {});
const renameGroupChat = asyncHandler(async (req, res) => {});
const removeFromGroupChat = asyncHandler(async (req, res) => {});
const addToGroupChat = asyncHandler(async (req, res) => {});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroupChat,
  addToGroupChat,
  renameGroupChat,
};
