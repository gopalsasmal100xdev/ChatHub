const asyncHandler = require("express-async-handler");
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");

/**
 * fetch all chats -> GET api/chat
 * create chat -> POST api/chat
 */

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user?._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error?.message);
  }
});
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("User id not send with request");
    return res.status(400);
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatdata = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user?._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatdata);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error?.message);
    }
  }
});

/**
 * route : POST req -> api/chat/group
 */
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 1) {
    return res
      .status(400)
      .send("More than 1 users are required to form a group chat");
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      name: req.body?.name,
      users: users,
      isGroupChat: true,
      groupAdmin: [req.user],
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

/**
 * rename group name -> PUT request -> /api/chat/rename
 */
const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      name: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});
/**
 *  @dev PUT request -> /api/chat/groupRemove
 *  @param {chatId , userId}
 */
const removeFromGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

/**
 * add new member to group chat ; PUT request -> "api/chat/add/addMemberInGroup"
 */
const addToGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  // TODO : IF user already in a group then not add in group
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroupChat,
  addToGroupChat,
  renameGroupChat,
};
