const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 4000;
const cors = require("cors");

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rooms = {};

//@route get index
app.get("/", (req, res) => {
  res.json({ msg: "tensorchat api" });
});

//@route get room status
app.post("/room", (req, res) => {
  if (rooms[req.body.roomName] == null) {
    return res.json({
      data: {
        roomName: `${req.body.roomName}`,
        msg: "room_does_not_exist"
      }
    });
  }
  res.json({
    data: {
      roomName: `${req.body.roomName}`,
      msg: "room_exists"
    }
  });
});

//@route create room
app.post("/createroom", (req, res) => {
  if (rooms[req.body.roomName] != null) {
    return res.json({
      data: {
        roomName: `${req.body.roomName}`,
        msg: "duplicate"
      }
    });
  }
  rooms[req.body.roomName] = { users: [] };
  res.json({
    data: {
      roomName: `${req.body.roomName}`,
      msg: "created"
    }
  });
});

//socket connection established
io.on("connection", socket => {
  //subscribe to room
  const subscribe = room => {
    io.in(room).clients((error, clients) => {
      if (error) {
        throw error;
      }
      if (clients.length > 2) {
        socket.emit("session_active");
        return;
      }
      socket.join(room);
      rooms[room] = { users: [...clients] };

      if (clients.length < 2) {
        if (clients.length == 1) socket.emit("create_host");
      }
    });
  };

  //siganl offer to remote
  const sendOffer = (room, offer) => {
    socket.to(room).broadcast.emit("new_offer", offer);
  };

  //signal answer to remote
  const sendAnswer = (room, data) => {
    socket.to(room).broadcast.emit("new_answer", data);
  };

  //user disconnected
  const user_disconnected = room => {
    socket.to(room).broadcast.emit("end");
  };
  //events
  socket.on("subscribe", subscribe);
  socket.on("offer", sendOffer);
  socket.on("answer", sendAnswer);
  socket.on("user_disconnected", user_disconnected);
});

app.use(function(req, res, next) {
  res.status(404);
  res.send("4oh4");
});

server.listen(PORT, () => {
  console.log(`server started on PORT -> ${PORT}`);
});
