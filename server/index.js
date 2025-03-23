// ECMA scripts are asynchronous, compared to CommonJS
import { Server } from "socket.io";
import http from "http"; // Needed to create an HTTP server

// Create an HTTP server (if you don’t already have one)
const http_server = http.createServer();

// Initialize a new Socket.IO server
const io = new Server(http_server, {
  cors: {
    origin: "*", //["http://localhost:5000"], // Adjust this for security in production
  },
});

const messageHistory = []; // Array to store message history

// Listen for new connections; occurs when a client connects to the server
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  socket.emit("messageHistory", messageHistory);

  // These are the events defined for each client once they connect:
  // Listen for messages from the client
  socket.on("sendMessage", (message) => {
    console.log(`Received message from ${socket.id}: ${message}`);
    messageHistory.push(message); // Store the message in history

    // Broadcast message to all connected clients
    io.emit("receiveMessage", message);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

// Start the server on port 5000
http_server.listen(5000, () => {
  console.log("Server is listening on port 5000");
});