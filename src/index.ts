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

// const rooms: any[] = [];
let broadcaster: string;

io.on('connection', (socket: Socket) => {
  socket.on('broadcaster', () => {
    broadcaster = socket.id;
    socket.broadcast.emit('broadcaster');
  });
  socket.on('watcher', () => {
    socket.to(broadcaster).emit('watcher', socket.id);
  });
  socket.on('disconnect', () => {
    socket.to(broadcaster).emit('disconnectPeer', socket.id);
  });
  socket.on('offer', (id, message) => {
    socket.to(id).emit('offer', socket.id, message);
  });
  socket.on('answer', (id, message) => {
    socket.to(id).emit('answer', socket.id, message);
  });
  socket.on('candidate', (id, message) => {
    socket.to(id).emit('candidate', socket.id, message);
  });
  socket.on('comment', (id, message) => {
    socket.to(id).emit('comment', socket.id, message);
  });
  // socket.on('join room', (roomId) => {
  //   if (rooms[roomId]) {
  //     rooms[roomId].push(socket.id);
  //   } else {
  //     rooms[roomId] = [socket.id];
  //   }

  //   console.log(rooms);

  //   const otherUser = rooms[roomId].find((id: string) => id !== socket.id);
  //   if (otherUser) {
  //     socket.emit('other user', otherUser);
  //     socket.to(otherUser).emit('user joined', socket.id);
  //   }
  // });

  // socket.on('offer', (payload) => {
  //   io.to(payload.target).emit('offer', payload);
  // });

  // /*
  //   The receiving peer answers (accepts) the offer
  // */
  // socket.on('answer', (payload) => {
  //   io.to(payload.target).emit('answer', payload);
  // });

  // socket.on('ice-candidate', (incoming) => {
  //   io.to(incoming.target).emit('ice-candidate', incoming.candidate);
  // });
});

instrument(io, {
  auth: false,
});

httpServer.listen(3000);
