const io = require("socket.io-client");
const socket = io("https://p2p-beta.herokuapp.com");
const room_container = document.getElementById('room_container');


socket.on('room_created', room=>{
    const room_element = document.createElement('div');
    room_element.innerText = room;
    const room_link = document.createElement('a');
    room_link.href = `/r/${room}`;
    room_link.innerText = 'Join';

    //append elements to container
    room_container.append(room_element);
    room_container.append(room_link);
})

