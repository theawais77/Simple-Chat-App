const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files from public directory
app.use(express.static('public'));

// Store connected users
const users = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Handle new user joining
    socket.on('new-user', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
        console.log(`${name} joined the chat`);
    });
    
    // Handle chat messages
    socket.on('send-chat-message', (message) => {
        socket.broadcast.emit('chat-message', {
            message: message,
            user: users[socket.id]
        });
    });
    
    // Handle user disconnect
    socket.on('disconnect', () => {
        const userName = users[socket.id];
        if (userName) {
            socket.broadcast.emit('user-disconnected', userName);
            delete users[socket.id];
            console.log(`${userName} left the chat`);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});