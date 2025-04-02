// ECMA scripts are asynchronous, compared to CommonJS
import { Server } from "socket.io";
import http from "http"; 
import ChatServer from "./server.js";

const server = new ChatServer(); // Create an instance of the ChatServer class
server.start(5000); // Start the server on port 5000