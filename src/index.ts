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

const rooms: any[] = [];

io.on('connection', (socket: Socket) => {
  socket.on('join room', (roomId) => {
    if (rooms[roomId]) {
      rooms[roomId].push(socket.id);
    } else {
      rooms[roomId] = [socket.id];
    }

    console.log(rooms);

    const otherUser = rooms[roomId].find((id: string) => id !== socket.id);
    if (otherUser) {
      socket.emit('other user', otherUser);
      socket.to(otherUser).emit('user joined', socket.id);
    }
  });

  socket.on('offer', (payload) => {
    io.to(payload.target).emit('offer', payload);
  });

  /*
    The receiving peer answers (accepts) the offer
  */
  socket.on('answer', (payload) => {
    io.to(payload.target).emit('answer', payload);
  });

  socket.on('ice-candidate', (incoming) => {
    io.to(incoming.target).emit('ice-candidate', incoming.candidate);
  });
});

instrument(io, {
  auth: false,
});

httpServer.listen(3000);
