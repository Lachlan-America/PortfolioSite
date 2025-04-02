import { Server as SocketServer } from "socket.io";
import http from "http"; 
import express from "express";
import jwt from 'jsonwebtoken';

export default class ChatServer {
    SECRET_KEY = '3nh213bh1ygxsa23';
    constructor() {
        this.clients = [];
        this.messageHistory = []; 
        this.app = express(); // Create an Express app
        this.http_server = http.createServer(this.app); // Create an HTTP server (if you don’t already have one)
        this.io = new SocketServer(this.http_server, {
            cors: {
            origin: "*", //["http://localhost:5000"], // Don't want other domains to run scripts on this server
            },
            pingInterval: 10000,  // Send a ping every 10 seconds
            pingTimeout: 5000,    // Disconnect if no pong within 5 seconds
        });    
    }

    start(port) {
        this.http_server.listen(port, () => this.debug(`Server running on http://localhost:${port}`));
        this.handleClient(); // Call the function to handle client connections

        // Checks for duplicate users
        this.app.post('/api/check-username', async (req, res) => {
            const { username } = req.body;
          
            try {
              const user = await User.findOne({ username }); // Query your database for the username
              if (user) {
                return res.status(400).json({ message: 'Username already taken' });
              }
              res.status(200).json({ message: 'Username is available' });
            } catch (err) {
              res.status(500).json({ message: 'Server error' });
            }
          });
    }

    handleClient() {
        // Middleware to authenticate the socket connection using JWT
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
          
            if (!token) {
                this.debug(`'${socket.id}' didn't provide a token!`);
                return next(new Error('Authentication error'));
            }
          
            try {
                const payload = jwt.verify(token, ChatServer.SECRET_KEY);
                socket.user = payload; // Attach user info to socket object if needed
                next();
            } catch (err) {
                this.debug(`'${socket.id}' has a invalid token!`);
                return next(new Error('Invalid token'));
            }
        });

        this.io.on("connection", (socket) => {
            this.addClient(socket)

            // When this client uses the 'sendMessage' event, this callback is executed
            socket.on("sendMessage", (obj) => {
                this.sendMessage(socket, obj);
            });
        
            // Handle disconnections to avoid memory leaks
            socket.on("disconnect", () => {
                this.removeClient(socket);
            });
        });
    }

    addClient(socket) {
        this.clients.push(socket);
        // Log in the console the ID of the user that connected
        this.debug(`User '${socket.id}' connected`);            
        // Send the message history to the newly connected client                                     
        socket.emit("messageHistory", { history: this.messageHistory, sender: socket.id.toString() }); 
    }

    sendMessage(socket, obj) {
        this.debug(`${socket.id}: ${obj.text}`);
        // Store the message in the message history
        this.messageHistory.push({text: obj.text, sender: socket.id.toString()});
        // Broadcast message to all connected clients
        this.io.emit("receiveMessage", { text: obj.text, sender: socket.id.toString() });
    }

    removeClient(socket) {
        // Remove the client from the list of connected clients
        this.clients = this.clients.filter(c => c !== socket);
        this.debug(`User '${socket.id}' disconnected`);
    }

    debug(message){
        const date = new Date();
        console.log(`${date.toTimeString().slice(0, 8)}: ${message}`);
    }
}  