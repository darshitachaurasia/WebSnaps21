require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const commands = {
    "hello": { type: "text", response: "Hi there! How can I help you?" },
    "how are you": { type: "text", response: "I'm doing great! How about you?" },
    "show cat": { type: "image", response:"Here's your beautiful cat" },
    "show sunset": { type: "image", response: "Beautiful sunset at the beach" }
};

io.on('connection', (socket) => {
    console.log('✅ User connected');

    socket.on('message', async (msg) => {
        console.log('User message:', msg);
        const command = commands[msg.toLowerCase()];

        if (command) {
            if (command.type === "text") {
                socket.emit('botMessage', { type: 'text', text: command.response });
            } else if (command.type === "image") {
                
                socket.emit('botMessage', { type: 'image', text: command.response });
            }
        } else {
            socket.emit('botMessage', { type: 'text', text: "Sorry, I don't understand that command." });
        }
    });
});



server.listen(5000, () => console.log('✅ Server running on http://localhost:5000'));
