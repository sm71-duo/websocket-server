import { Server } from 'ws';

const wss = new Server({ port: 3000 });

wss.on('connection', (ws, req) => {
  if (ws.readyState === ws.OPEN) {
    const ip = req.socket.remoteAddress;

    ws.send(
      JSON.stringify({
        message: `Client with IP address ${ip} Connected to the server`,
      })
    );

    ws.on('message', (message) => {
      console.log('received: %s', message);
      ws.send(
        JSON.stringify({
          message: 'Message from the server!',
        })
      );
    });
  }
});
