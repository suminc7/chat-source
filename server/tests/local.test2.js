
const SocketIOClient = require('socket.io-client');

// const socket = SocketIOClient('http://35.200.56.123:3000');
// const socket = SocketIOClient(process.env.SOCKET_URL || 'http://localhost:8080');
const socket = SocketIOClient(process.env.SOCKET_URL || 'http://104.154.154.54/');

let _userId;

socket.on('connect', function(data){
    console.log('connected:', socket.id);
    // socket.emit('message', 'emit first message');



    socket.on('hostname', function(hostname) {
        console.log('hostname:', hostname);
    });
    //
    // socket.on('new_message', function(message) {
    //     console.log('new_message: ', message)
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
    //     socket.emit('add_user', 'kkany' + count)
    // }, 1000)
    //






});

socket.on('message', function(message){
    console.log('message:', message);

});

// Allow the server to participate in the chatroom through stdin.
var stdin = process.openStdin();
stdin.addListener('data', function(d) {

    socket.emit('new_message', d.toString().trim());

});