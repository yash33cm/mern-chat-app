const express = require("express");
const helmet = require("helmet");
const createError = require("http-errors");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
require("./models/dbconfig/dbcon");
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.get("/", async (req, res, next) => {
  res.send({ message: "Awesome it works 🐻" });
});

//app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/chats", require("./routes/chat"));
app.use("/messages", require("./routes/message"));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT;
const server = app.listen(PORT, () =>
  console.log(`🚀 @ http://localhost:${PORT}`)
);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to sockets");

  socket.on("newroom", (userdata) => {
    // console.log(userdata.id);
    socket.join(userdata.id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`user joined room ${room}`);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (incomingmessage) => {
    let chat = incomingmessage.chat;
    if (!chat.users) return console.log("no users");

    chat.users.forEach((user) => {
      if (user._id == incomingmessage.sender._id) return;
      socket.in(user._id).emit("send message", incomingmessage);
    });
  });
});
