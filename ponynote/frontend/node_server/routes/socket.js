

// export function for listening to the socket
module.exports = function (socket) {
  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    socket.broadcast.emit('send:message', data);
  });

  socket.on('delete:message', function (data) {
    socket.broadcast.emit('delete:message', data);
  });

};
