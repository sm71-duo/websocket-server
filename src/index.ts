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

let activeSockets: string[] = [];

io.on('connection', (socket: Socket) => {
  const existingSocket = activeSockets.find((existingSocket) => existingSocket === socket.id);

  if (!existingSocket) {
    activeSockets.push(socket.id);

    socket.emit('update-user-list', {
      users: activeSockets.filter((existingSocket) => existingSocket !== socket.id),
    });

    socket.broadcast.emit('update-user-list', {
      users: [socket.id],
    });
  }

  socket.on('disconnect', () => {
    activeSockets = activeSockets.filter((existingSocket) => existingSocket !== socket.id);
    socket.broadcast.emit('remove-user', {
      socketId: socket.id,
    });
  });

  socket.on('call-user', (data) => {
    console.log('call-user: ', data);
    socket.to(data.to).emit('call-made', {
      offer: data.offer,
      socket: socket.id,
    });
  });

  socket.on('make-answer', (data) => {
    console.log('make-answer: ', data);
    socket.to(data.to).emit('answer-made', {
      socket: socket.id,
      answer: data.answer,
    });
  });
});

instrument(io, {
  auth: false,
});

httpServer.listen(3000);

// socket.on('broadcaster', () => {
//   broadcaster = socket.id;
//   console.log(broadcaster);
//   socket.broadcast.emit('broadcaster');
// });
// socket.on('watcher', () => {
//   socket.to(broadcaster).emit('watcher', socket.id);
// });
// socket.on('disconnect', () => {
//   socket.to(broadcaster).emit('disconnectPeer', socket.id);
// });
// socket.on('offer', (id, message) => {
//   socket.to(id).emit('offer', socket.id, message);
// });
// socket.on('answer', (id, message) => {
//   socket.to(id).emit('answer', socket.id, message);
// });
// socket.on('candidate', (id, message) => {
//   socket.to(id).emit('candidate', socket.id, message);
// });
// socket.on('comment', (id, message) => {
//   socket.to(id).emit('comment', socket.id, message);
// });

// const rooms: any[] = [];
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
