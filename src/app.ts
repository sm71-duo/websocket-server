import * as express from 'express';

const app = express();
const port = 6000;
app.set('port', process.env.PORT || port);

let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.send('The sedulous hyena ate the antelope!');
});
app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});

const users = [];

io.on('connection', function (socket: any) {
  socket.on('add user', function (user_id: any) {
    users.push(user_id);
  });

  socket.on('chat message', function (msg: any) {
    io.emit('chat message', msg);
  });
  socket.on('voice sent', function (msg: any) {
    io.emit('voice received', msg);
  });
});

http.listen(3000, function () {
  console.log('listening on *:6000');
});
