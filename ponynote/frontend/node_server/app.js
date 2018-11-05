const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const app = express();
var socket = require('./routes/socket.js');

const server = http.createServer(app);
const io = socketIo(server);
io.sockets.on('connection', socket);

server.listen(port, () => console.log(`Listening on port ${port}`));