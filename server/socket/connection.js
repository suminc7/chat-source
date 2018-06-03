const room = require('./room');
const user = require('./user');

exports.disconnected = (data, socket) => {
    console.log('--- disconnected ---', socket.id, socket.room, socket.user)
    user.disconnected(socket)
    if(socket.room) {
        const roomId = socket.room.id
        if(roomId) {
            room.leave(roomId, socket)
        }
    }

}

exports.error = (err) => {
    if(err) throw new Error(err)
    console.log('socket error', err)
}