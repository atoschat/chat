const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Initialize Express app and server
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Track active users
let activeUsers = 0;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Socket.IO connection handling
io.on('connection', (socket) => {
    // Increment active users count and notify all clients
    activeUsers++;
    io.emit('activeUsers', activeUsers);

    console.log(`A user connected. Active users: ${activeUsers}`);

    // Handle username event
    socket.on('username', (username) => {
        console.log(`${username} joined the chat!`);
        io.emit('system message', `${username} has joined the chat`);
    });

    // Handle chat message event
    socket.on('chat message', (msg, username) => {
        console.log(`Message from ${username}: ${msg}`);
        io.emit('chat message', msg, username);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        activeUsers--;
        console.log(`A user disconnected. Active users: ${activeUsers}`);
        io.emit('activeUsers', activeUsers);
    });
});

// Set up the server to listen on the specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
