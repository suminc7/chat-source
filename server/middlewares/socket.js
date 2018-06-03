const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require ('../models/user')

//socket Authentication
exports.authentication = () => {
    return (socket, next) => {
        let token = socket.handshake.headers['token'];
        jwt.verify(token, config.app.secret, (err, decode) => {
            if(err) return next(new Error('authentication error'));

            User.findOne({
                _id: decode._id,
            })
            .then(user => {
                if (!user) {
                    return next(new Error('authentication error'))
                } else {
                    socket.user = {
                        id: user._id.toString(),
                        nickname: user.nickname
                    }
                    return next()
                }
            })


            // console.log('----------------decode._id', decode._id)
            // return next();
        });

    }
}

exports.socket = (io) => {
    return (req, res, next) => {
        req.io = io;
        next();
    }
}