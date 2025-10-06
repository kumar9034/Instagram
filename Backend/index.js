const express = require("express")
const Cors = require("cors")
const connect  = require("./connceting/DB");
const Userrouter = require("./Routes/User-Router")
const musicRouter = require("./Routes/music-Router");
const postrouter = require("./Routes/post-router");
const helmet = require('helmet')
const {Server} = require("socket.io")
const http =  require("http")
const messageRouter = require("./Routes/message-router");
const Chats = require("./model/Chats");

const app = express()

connect()
app.use(helmet());

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(Cors(
    {origin: `${process.env.FRONTEND_URL || "http://localhost:5173"}`}
))
// app.use(bodyParser.json());
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: `${process.env.FRONTEND_URL || "http://localhost:5173"}`, // frontend ka URL daalna best practice hai
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) onlineUsers.set(userId, socket.id);

    socket.on("sendMessage", async ({ receiverId, text }) => {
    const newMsg = await Chats.create({ sender: userId, receiver: receiverId, text });
    
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) io.to(receiverSocket).emit("receiveMessage", newMsg);
    socket.emit("messageSent", newMsg);
  });

  socket.on("disconnect", () => onlineUsers.delete(userId));
});


app.use("/user", Userrouter)
app.use("/music", musicRouter)
app.use("/post", postrouter)
app.use("/chat", messageRouter)



server.listen(3000, ()=>{
    console.log("server run port 3000")
})