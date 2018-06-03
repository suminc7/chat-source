process.env.NODE_ENV = 'test';
process.env.PORT = 8989;

const io = require('socket.io-client');
const User = require('../models/user');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;
chai.use(chaiHttp);

let user = {
    "email": "test@test.com",
    "nickname": "test",
    "password": "123123!@#",
    "birthday": "1982/11/08",
    "gender": "m"
};

let token = ''
let roomId = ''
let socket = null
const URL = 'http://localhost:' + process.env.PORT


describe('Users', () => {

    before(() => { //Before each test we empty the database
        User.find({ "email": user.email }).remove().exec((err) => {
        });
    });



    describe('User auth', () => {
        it('should register a user', (done) => {
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });


        it('it should login a user', (done) => {
            let loginUser = {
                "email": user.email,
                "password": user.password
            };

            chai.request(server)
                .post('/api/auth/login')
                .send(loginUser)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message');
                    expect(res.body).to.have.property('token');
                    token = res.body.token
                    done()
                });
        });
    });

});


describe('Room', () => {

    describe('Room create', () => {
        it('should create a room', (done) => {
            chai.request(server)
                .post('/api/room/create')
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .send({
                    "title": "안녕..xxxx",
                    "maxUser": 5,
                    "tags": ["배그", "battle"]
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('id');
                    roomId = res.body.id;
                    done();
                });
        });

        it('should get a room', (done) => {
            chai.request(server)
                .get('/api/room/'+roomId)
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('id');
                    expect(res.body.id).to.equal(roomId);
                    done();
                });
        });

        it('should change info of room', (done) => {
            chai.request(server)
                .put('/api/room/'+roomId)
                .set('Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json')
                .send({
                    "title": "hello",
                    "maxUser": 6,
                    "tags": ["배그", "battle"]
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('id');
                    expect(res.body.id).to.equal(roomId);
                    expect(res.body.title).to.equal('hello');
                    expect(res.body.maxUser).to.equal('6');
                    done();
                });
        });

        it('should connect websocket', (done) => {

            socket = io(process.env.SOCKET_URL || URL, {
                reconnection: false,
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

            socket.once('connect', function(){

                socket.on('connect_error', () => {
                    console.log('connect_error');
                });

                socket.on('connected', (data) => {
                    done();
                })
            });
        });

        it('should join the room', (done) => {

            socket.on('join', function(result) {
                if(result){
                    expect(result.id).to.equal(roomId);
                    done();
                }else{
                    console.log('join failed', result);
                }
            });

            socket.emit('join', roomId);

        });

    });

});