const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const PORT = 8080;
const app = express();

app.use(cors());

const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Socket setup
const io = socket(server);

const users = [];

io.on('connect_error', (err: any) => {
  console.log(`connect_error due to ${err.message}`);
});

io.on('connection', function (socket: any) {
  console.log('Made socket connection');
  socket.on('add user', function (user_id: any) {
    users.push(user_id);
  });

  socket.on('chat message', function (msg: any) {
    console.log(msg);
    io.emit('chat message', msg);
  });
  socket.on('voice sent', function (msg: any) {
    io.emit('voice received', msg);
  });
});
