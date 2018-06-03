const io = require('socket.io-client');
const axios = require('axios')


// const URL = 'http://35.224.81.89/'
const URL = 'http://localhost:8080/'

axios.defaults.baseURL = URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.get['Content-Type'] = 'application/json';


exports.start = function(data) {
    axios.post('/api/auth/login', data)
        .then(response => {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
            startSocket(response.data.token)
        })
        .catch(error => {
            console.log('error', error.response.data);
        });

}


function startSocket(token) {
    const socket = io(process.env.SOCKET_URL || URL, {
        reconnection: false,
        transportOptions: {
            polling: {
                extraHeaders: {
                    token
                }
            }
        }
    });
    let isConnect = false
    let roomId = null

    socket.on('error', (error) => {
        console.log('error', error);
    });

    socket.once('connect', function(){
        console.log('connected:', socket.id);

        // if(isConnect) return

        socket.on('connect_error', () => {
            console.log('connect_error');
        });

        socket.on('connected', (data) => {
            console.log(data);
        })

        socket.on('message', (data) => {
            console.log(data)
        })
        socket.on('chat.message', (data) => {
            console.log(`${data.user.nickname}: ${data.message}`);
        })

        socket.on('chat.whisper', (data) => {
            console.log('chat.whisper', data);
        })

        //TODO: 구현 필요
        socket.on('leave', (result) => {
            if(result){
                console.log('leave success', result);
            }else{
                console.log('leave failed', result);
            }
        });


        socket.on('join', function(result) {
            if(result){
                console.log('join success', result);
                roomId = result.id
            }else{
                console.log('join failed', result);
            }
        });

        isConnect = true

        request.roomList()

    });

    const request = require('./request')

// Allow the server to participate in the chatroom through stdin.
    var stdin = process.openStdin();
    stdin.addListener('data', function(d) {

        const cmd = d.toString().trim()

        if(cmd === 'list'){
            request.roomList()
        }else if(cmd.split(' ')[0] === 'users'){
            request.userList(cmd.split(' ')[1])
        }else if(cmd.split(' ')[0] === 'j'){
            socket.emit('join', cmd.split(' ')[1]);
        }else if(cmd.split(' ')[0] === 'l'){
            socket.emit('leave', cmd.split(' ')[1]);
        }else if(cmd.split(' ')[0] === 'm'){
            socket.emit('chat.message', cmd.split(' ')[1]);
        }else if(cmd.split(' ')[0] === 'w'){
            socket.emit('chat.whisper', { roomId, userId: cmd.split(' ')[1], message: cmd.split(' ')[2] });
        }

    });




}