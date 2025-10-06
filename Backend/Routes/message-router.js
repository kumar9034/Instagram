const express = require("express")
const isloggedIn = require("../config/isloggedin");
const Chats = require("../model/Chats")

const router = express.Router()

router.post('/sendmessage', isloggedIn, async(req, res)=>{
     const senderId = req.user.id;
  const { receiverId, text } = req.body;

  if (!receiverId || !text)
    return res.status(400).json({ message: "Receiver and text required" });

  try {
    const newMsg = await Chats.create({ sender: senderId, receiver: receiverId, text });
    res.json(newMsg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

router.get("/message/:friendId", isloggedIn, async (req, res) => {
  const userId = req.user.id;
  const friendId = req.params.friendId;

  try {
    const messages = await Chats.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
    console.log(messages)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router