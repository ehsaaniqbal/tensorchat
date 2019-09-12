const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 5000;

//middleware
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const rooms = {};

//@route -> index
app.get("/", (req, res) => {
  res.render("index", { rooms: rooms });
});

//@route -> room
app.get("/r/:room", (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.render("roomdoesnotexist");
  }
  res.render("room", { room_name: req.params.room });
});

//@route -> createroom[post]
app.post("/createroom", (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.render("roomalreadyexists");
  }
  rooms[req.body.room] = { users: {} };
  res.redirect(`/r/${req.body.room}`);
  io.emit("room_created", req.body.room);
});

//socket connection established
io.on("connection", socket => {
  socket.on("new_client", room => {
    io.in(room).clients(function(error, clients) {
      if (error) {
        throw error;
      }
      if (clients.length >= 2) {
        socket.emit("session_active");
        return;
      }
      socket.join(room);

      if (clients.length < 2) {
        if (clients.length == 1) socket.emit("create_peer");
      }
    });
  });

  const send_offer = (room, offer) => {
    socket.to(room).broadcast.emit("sent_offer", offer);
  };

  const send_answer = (room, data) => {
    socket.to(room).broadcast.emit("sent_answer", data);
  };

  const disconnect = room => {
    socket.to(room).emit("remove_peer");
  };

  //events
  socket.on("offer", send_offer);
  socket.on("answer", send_answer);
  socket.on("user_disconnected", disconnect);
});

app.use(function(req, res, next) {
  res.status(404);
  res.send("404");
});

server.listen(PORT, () => {
  console.log(`Server started on PORT --> ${PORT}`);
});
