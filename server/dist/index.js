'use strict';

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _slack = require('../slack');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var os = require('os');
var morgan = require('morgan');
var app = require('express')();

// const statusMonitor = require('express-status-monitor')();


var env = require('node-env-file');
env(__dirname + '/../.env');

// app.use(statusMonitor);
app.use(morgan('dev'));
// app.use('/status', serverStatus(app));

var server = require('http').createServer(app);
var io = require('socket.io')(server);

// Redis.
var redisOptions = {
    host: process.env.REDIS_SERVICE_HOST || process.env.REDIS_PORT_6379_TCP_ADDR || 'localhost',
    port: process.env.REDIS_SERVICE_PORT || 6379
};

var client = _redis2.default.createClient(redisOptions);
var errFn = function errFn(err) {
    throw new Error('Redis error ' + err);
};
client.on('error', errFn);

// Redis Adapter.
var adapter = require('socket.io-redis')(redisOptions);
adapter.pubClient.on('error', errFn);
adapter.subClient.on('error', errFn);
io.adapter(adapter);

// Messages storage.
var messagesListMax = process.env.MESSAGES_LIST_MAX || 10;
var messagesListName = process.env.MESSAGES_LIST_NAME || 'node-example-messages';

// Websockets.
io.sockets.on('connection', function (socket) {

    console.log('Connection : ', socket.id);

    socket.on('userJoined', function (userId) {
        return onUserJoined(userId, socket);
    });
    socket.on('message', function (message) {
        return onMessageReceived(message, socket);
    });

    io.of('/').adapter.clients(function (err, clients) {
        console.log(clients); // an array containing all connected socket ids
    });

    // io.of('/').adapter.remoteJoin(socket.id, 'room1', (err) => {
    //     if (err) { /* unknown id */ }
    //     // success
    //     console.log('remoteJoin', 'room1', socket.id);
    //
    //     io.of('/').adapter.clients(['room1', 'room2'], (err, clients) => {
    //         console.log('room1: ', clients); // an array containing socket ids in 'room1' and/or 'room2'
    //     });
    //
    // });
    //
    //
    // // io.of('/').adapter.clients((err, clients) => {
    // //     console.log(clients); // an array containing all connected socket ids
    // // });
    //
    //
    // socket.emit('hostname', os.hostname());


    socket.on('disconnect', function (data) {
        console.log('disconnect: ', socket.id, 'type:', data);
        // if (!addedUser) return;
        // io.emit('user_left', {
        //     username: socket.username
        // });
    });

    // var addedUser = false;
    // var hostname = os.hostname();
    // console.log('Connection : ', new Date());
    // socket.emit('hostname', hostname);
    //
    // io.of('/').adapter.clients((err, clients) => {
    //     console.log(clients); // an array containing all connected socket ids
    // });
    //
    // socket.on('login', function () {
    //     console.log('login')
    //     client.lrange(messagesListName, 0, -1, function (err, messages) {
    //         if (err) console.error(err);
    //         else {
    //             messages.forEach(function (message) {
    //                     console.log('messages:', message)
    //                 var m = JSON.parse(message);
    //                 if (m.username && m.message) {
    //                     socket.emit('new_message', m);
    //                 }
    //             });
    //         }
    //     });
    // })
    //
    // socket.on('new_message', function(message) {
    //     console.log('socket.username:', socket.username)
    //     var fullMessage = {
    //         username: socket.username,
    //         message: message,
    //     };
    //     io.emit('new_message', fullMessage);
    //     client.rpush(messagesListName, JSON.stringify(fullMessage));
    //     client.ltrim(messagesListName, -messagesListMax, -1)
    // });
    //
    // socket.on('add_user', function(username) {
    //     if (addedUser) return;
    //     socket.username = username;
    //     addedUser = true;
    //     io.emit('user_joined', {
    //         username: socket.username,
    //         hostname: hostname,
    //     });
    // });
    //
    // socket.on('disconnect', function() {
    //     if (!addedUser) return;
    //     io.emit('user_left', {
    //         username: socket.username
    //     });
    // });

});

// Event listeners.
// When a user joins the chatroom.
function onUserJoined(userId, socket) {

    console.log('onUserJoined:', userId);

    socket.emit('userJoined', userId);

    // try {
    //     // The userId is null for new users.
    //     if (!userId) {
    //         var user = db.collection('users').insert({}, (err, user) => {
    //             socket.emit('userJoined', user._id);
    //             users[socket.id] = user._id;
    //             _sendExistingMessages(socket);
    //         });
    //     } else {
    //         users[socket.id] = userId;
    //         _sendExistingMessages(socket);
    //     }
    // } catch(err) {
    //     console.err(err);
    // }
}

// When a user sends a message in the chatroom.
function onMessageReceived(message, socket) {

    // socket.emit('message', message);
    socket.broadcast.emit('message', message);
    // io.emit('message', message);


    // var userId = users[senderSocket.id];
    // // Safety check.
    // if (!userId) return;
    //
    // _sendAndSaveMessage(message, senderSocket);
}

function _sendAndSaveMessage(message, socket, fromServer) {
    var messageData = {
        text: message.text,
        user: message.user,
        createdAt: new Date(message.createdAt),
        chatId: chatId
    };

    console.log('user', message.user, ' message', message.text);

    db.collection('messages').insert(messageData, function (err, message) {
        // If the message is from the server, then send to everyone.
        var emitter = fromServer ? websocket : socket.broadcast;
        emitter.emit('message', [message]);
    });
}

// Helper functions.
// Send the pre-existing messages to the user that just joined.
function _sendExistingMessages(socket) {
    var messages = db.collection('messages').find({ chatId: chatId }).sort({ createdAt: 1 }).toArray(function (err, messages) {
        // If there aren't any messages, then return.
        if (!messages.length) return;
        socket.emit('message', messages.reverse());
    });
}

server.listen(8080);
console.log('socket.io server listening on *:8080, running on node %s', process.version);

(0, _slack.slackWebsocketOn)();