const express = require('express');
const socket = require('socket.io');
const PORT = 8080;
const app = express();
const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
// Socket setup
const io = socket(server);
const users = [];
io.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
});
io.on('connection', function (socket) {
    console.log('Made socket connection');
    socket.on('add user', function (user_id) {
        users.push(user_id);
    });
    socket.on('chat message', function (msg) {
        console.log(msg);
        io.emit('chat message', msg);
    });
    socket.on('voice sent', function (msg) {
        io.emit('voice received', msg);
    });
});
//# sourceMappingURL=app.js.map