const express = require("express");
const app = express();
const server = require("http").Server(app);

const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

//middleware
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const rooms = {};
let clients = 0;

//@route -> index
app.get("/", (req, res) => {
  res.render("index", { rooms: rooms });
  
});

//@route -> room
app.get("/r/:room", (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.send("Room does not exist");
  }
  res.render("room", { room_name: req.params.room });
});

//@route -> createroom[post]
app.post("/createroom", (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect("/");
  }
  rooms[req.body.room] = { users: {} };
  res.redirect(`/r/${req.body.room}`);
  io.emit("room_created", req.body.room);
});

//socket connection established
io.on("connection", socket => {
  socket.on("new_client", room => {
    socket.join(room);
    if (clients < 2) {
      if (clients == 1) {
        socket.emit("create_peer");
      }
    } else socket.emit("session_active");

    clients++;
  });

  const send_offer = (room, offer) => {
    socket.to(room).broadcast.emit("sent_offer", offer);
  };

  const send_answer = (room, data) => {
    socket.to(room).broadcast.emit("sent_answer", data);
  };

  const disconnect = () => {
    if (clients > 0) {
      if (clients <= 2) {
        socket.broadcast.emit("remove_peer");
      }
      clients--;
    }
  };

  //events
  socket.on("offer", send_offer);
  socket.on("answer", send_answer);
  socket.on("disconnect", disconnect);
});

server.listen(PORT, () => {
  console.log(`Server started on PORT --> ${PORT}`);
});
