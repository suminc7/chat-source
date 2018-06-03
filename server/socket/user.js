const client = require('../src/redis');


exports.connected = (socket) => {

    // user 최초 접속
    client.hset('users', socket.id, socket.user.id)
    client.hmset('user:'+socket.user.id, socket.user) // user key 생성
}

exports.disconnected = (socket) => {
    client.hdel('users', socket.id)
    client.del('user:'+socket.user.id, (err, value) => {
        if (err) throw new Error('users del failed');
        console.log('del', 'users'+socket.user.id, value)
    })
};

