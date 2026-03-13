const express = require('express');
const https = require('https');
const { Server } = require('socket.io');
const fs = require('fs');
const app = express();

// 💡 read the certificate files
const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
  };

const server = https.createServer(options, app);

// Add root route handler
app.get('/', (req, res) => {
  res.json({ message: 'Gyro WebSocket Server is running' });
});

// server/index.js
const io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"]
    },
    // 💡 shorten the ping time, so that the Server can quickly find that the device has been refreshed (disconnected)
    pingTimeout: 5000, 
    pingInterval: 10000,
    allowEIO3: true,
    transports: ['websocket'],
    extraHeaders: {
        "ngrok-skip-browser-warning": "true" 
    }
  });

const PORT = 3000;

io.on('connection', (socket) => {
    console.log('device connected:', socket.id);
    
    socket.on('gyro-update', (data) => {
      // 💡 let the Server broadcast the data with a new name
    socket.broadcast.emit('gyro-data-received', data);
      });
  
    socket.on('disconnect', () => {
      console.log('device disconnected:', socket.id);
    });

    // server/index.js
    socket.on('trigger-vibrate', () => {
      socket.broadcast.emit('vibrate-command'); // 手機端在聽這個
    });
  });


  server.listen(PORT, '0.0.0.0', () => {
    console.log(`HTTPS Server is running on https://192.168.50.162:${PORT}`);
  });