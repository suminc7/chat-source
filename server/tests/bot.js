const axios = require('axios')
const _ = require('lodash')
const io = require('socket.io-client');

axios.defaults.baseURL = 'http://35.202.245.13/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

let isFirst = false

exports.socket = (token) => {
    const socket = io(process.env.SOCKET_URL || 'http://35.202.245.13/', {
        transportOptions: {
            polling: {
                extraHeaders: {
                    token
                }
            }
        }
    });

    socket.on('error', (error) => {
        console.log('error', error);
    });

    socket.on('connect', function(){
        console.log('connected:', socket.id);

        socket.on('connect_error', () => {
            console.log('connect_error');
        });

        socket.on('message', (data) => {
            console.log(data);
        })

        socket.on('join', function(result) {
            if(result){
                console.log('join success', result);
            }else{
                console.log('join failed');
            }
        });


    });

    return socket
}

exports.register = () => {

    const rnd = _.random(1000, 99999)

    const data = {
        "email": `test${rnd}@naver.com`,
        "nickname": `테스트${rnd}`,
        "password": "123123",
        "birthday": "1982/11/08",
        "gender": "m"
    }

    return axios.post('/api/auth/register', data)
        .then((response) => {
            console.log(response.data, data.email);
            this.login(data.email, data.password)
        })
        .catch((error) => {
            console.log(error.response.data);
        });

}


exports.login = (email, password) => {

    return axios.post('/api/auth/login', {
        email,
        password
    })
        .then(response => {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
            const socket = this.socket(response.data.token)

            setTimeout(() => {
                const rnd = _.random(2)
                console.log('rnd', rnd)
                if(!isFirst){
                    this.createRoom(socket)
                    isFirst = true
                }else{
                    this.getRoomList(socket)
                }
            }, 1000)

        })
        .catch(error => {
            console.log(error.response.data);
        });

}

exports.createRoom = (socket) => {

    const rnd = _.random(10000)

    const data = {
        "title": "안녕하세요.." + rnd,
        "maxUser": _.random(2, 10),
        "tags": ["배그", "battle"]
    }

    return axios.post('/api/room/create', data)
        .then((response) => {
            console.log('---------- created room ----------', response.data.id);
            socket.emit('join', response.data.id);


        })
        .catch((error) => {
            console.log(error.response.data);
        });

}

exports.getRoomList = (socket) => {

    // const rnd = _.random(20)
    const rnd = 1

    return axios.get('/api/room/list?page='+rnd)
        .then((response) => {
            const id = response.data.rooms[0]
            console.log('========== get page ==========', id)
            socket.emit('join', id);

            setTimeout(() => {
                const rnd = _.random(1)
                console.log('leave rnd', rnd)
                if(rnd === 0) {
                    socket.emit('leave' , id);
                }
            }, 2000)

        })
        .catch((error) => {
            console.log(error.response.data);
        });
}