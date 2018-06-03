const os = require('os');
const room = require('../socket/room');
const user = require('./user');
const connection = require('../socket/connection');

module.exports = function(io) {
    io.on('connection', function(socket) {
        // console.log('--- connected ---', socket.id);

        // console.log('socket.handshake', socket.handshake)

        user.connected(socket)

        socket.emit('connected', os.hostname())

        socket.on('join', (id) => room.join(id, socket));
        socket.on('leave', (id) => room.leave(id, socket));
        socket.on('chat.message', (message) => room.message(message, socket));
        socket.on('chat.whisper', data => room.whisper(data, socket));
        socket.on('disconnect', (data) => connection.disconnected(data, socket));
        socket.on('error', (err) => connection.error);
    })
}