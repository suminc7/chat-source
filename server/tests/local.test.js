
const io = require('socket.io-client');

// const socket = SocketIOClient('http://35.200.56.123:3000');
// const socket = SocketIOClient(process.env.SOCKET_URL || 'http://localhost:8080', {reconnection: false});
// const socket = io(process.env.SOCKET_URL || 'http://172.30.1.15:8080', {reconnection: false});
const socket = io(process.env.SOCKET_URL || 'http://35.224.141.195', {reconnection: false});


// const adminSocket = io('/admin');



socket.on('connect', function(data){
    console.log('connected:', socket.id);

    socket.emit('userJoined', {userId: socket.id, username: 'test1'});

    socket.on('connect_error', () => {
        console.log('connect_error');
    });

    // console.log(socket)
    // socket.emit('message', 'emit first message');



    socket.on('hostname', function(hostname) {
        console.log('hostname:', hostname);

    });
    //
    // socket.on('message', function(message) {
    //     console.log('message: ', message)
    // });
    //
    // socket.emit('login');
    //
    //
    //
    // let count = Math.floor(Math.random() * 1000);
    // socket.on('user_joined', function(data) {
    //     console.log('user_joined: ', data)
    // });
    // setTimeout(() => {
    //     socket.emit('add_user', 'sumin' + count)
    //     count++
    // }, 1000)







});

// Allow the server to participate in the chatroom through stdin.
var stdin = process.openStdin();
stdin.addListener('data', function(d) {

    socket.emit('message', d.toString().trim());

});