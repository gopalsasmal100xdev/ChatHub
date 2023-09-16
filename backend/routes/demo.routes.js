const express = require("express");
const router = express.Router();
const { chats } = require("../data/data");

router
  .route("/")
  .get((req, res) => {
    res.send("Hello");
  })
  .post((req, res) => {
    res.send("Hello");
  });

router.route("/api/chat").get((req, res) => {
  console.log(req.url);
  res.send(chats);
});
router.route("/api/chat/:id").get((req, res) => {
  const id = req.params.id;
  console.log(id);
  const singleChat = chats.find((c) => c._id === id);
  res.send(singleChat);
});
module.exports = router;
