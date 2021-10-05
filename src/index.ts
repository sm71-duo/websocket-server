import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import express from 'express';
const { instrument } = require('@socket.io/admin-ui');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});

io.on('connection', (socket: Socket) => {
  socket.on('join_room', (channel) => {
    console.log(socket.id + ' joined room with name ' + channel);
    socket.join(channel);
  });

  socket.on('leave_room', (channel) => {
    console.log(socket.id + ' left room with name ' + channel);
    socket.leave(channel);
  });

  socket.on('user_talking', (payload) => {
    console.log(payload);
    io.to(payload.channel).emit('talking', {
      talking: payload.talking,
      socketId: socket.id,
      channel: payload.channel,
    });
  });
});

instrument(io, {
  auth: false,
});

httpServer.listen(3000);
