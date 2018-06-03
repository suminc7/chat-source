const Room = require('../models/room');
const HttpStatus = require('http-status-codes');
const io = require('../src/io').get();

exports.join = (id, socket) => {

    const check = (value) => {
        return value === id
    };
    async function socketJoin() {
        await socket.join(id);
        socket.room = { id };
        socket.emit('join', { id });
        socket.broadcast.to(id).emit('message', socket.user.nickname + ' 님이 입장 했습니다.');

        Room.join(id, socket.user.id)
    }
    const onError = (error) => {
        socket.emit('join', {
            message: HttpStatus.getStatusText(error)
        })
    };
    Room.check(id)
        .then(check)
        .then(socketJoin)
        .catch(onError)

};

exports.message = (message, socket) => {

    const data = {
        user: socket.user,
        message,

    }
    if(socket.room && socket.room.id) io.in(socket.room.id).emit('chat.message', data)
}

exports.whisper = (data, socket) => {
    socket.to(data.userId).emit('chat.whisper', data);
}

exports.leave = (id, socket) => {

    async function leave() {
        await socket.leave(id);
        socket.room = { };
        socket.emit('leave', id);
        socket.broadcast.to(id).emit('message', socket.user.nickname + ' 님이 나갔습니다.');
    }

    leave().then(() => {
        Room.leave(id, socket.user.id)
    })
};