const jwt = require('jsonwebtoken')
const User = require('../../../models/user')
const validator = require('validator');
const config = require('../../../config');
const HttpStatus = require('http-status-codes');

/*
    POST /api/auth
    {
        username,
        password
    }
*/

exports.register = (req, res) => {
    const {
        email,
        nickname,
        password,
        birthday,
        gender
    } = req.body
    let newUser = null

    // create a new user if does not exist
    const create = (user) => {
        if(user) {
            throw new Error('nickname exists')
        } else {
            return User.create(email, nickname, password, birthday, gender)
        }
    }

    // count the number of the user
    const count = (user) => {
        newUser = user
        return User.count({}).exec()
    }


    // respond to the client
    const respond = () => {
        res.json({
            message: HttpStatus.getStatusText(200)
        })
    }

    // run when there is an error (username exists)
    const onError = (error) => {
        res.status(409).json({
            message: HttpStatus.getStatusText(409)
        })
    }

    // check username duplication
    User.findOneByUserInfo(email, nickname)
        .then(create)
        .then(count)
        .then(respond)
        .catch(onError)
}


exports.login = (req, res) => {
    const {email, password} = req.body
    const secret = config.app.secret

    console.log(email, password)

    // check the user info & generate the jwt
    const check = (user) => {
        if(!user) {
            console.log(user)
            // user does not exist
            throw new Error('login failed 1')
        } else {
            // user exists, check the password
            if(user.verify(password)) {
                // create a promise that generates jwt asynchronously
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            _id: user._id
                        },
                        secret,
                        {
                            expiresIn: '30d',
                            issuer: 'chat',
                            subject: 'user'
                        }, (err, token) => {
                            if (err) reject(err)
                            resolve(token)
                        })
                })
                return p
            } else {
                throw new Error('login failed 2')
            }
        }
    }

    // respond the token
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token
        })
    }

    // error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }

    // find the user
    User.findOneByEmail(email)
        .then(check)
        .then(respond)
        .catch(onError)

}

/*
    GET /api/auth/check/email
*/
exports.checkEmail = (req, res) => {
    const { email } = req.body

    if(!validator.isEmail(email)){
        res.json({
            result: 'not valid'
        })
        return
    }

    const respond = (user) => {
        res.json({
            result: !user ? 'accepted' : 'unaccepted'
        })
    }

    // error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }

    // find the user
    User.findOneByEmail(email)
        .then(respond)
        .catch(onError)


}

exports.checkNickname = (req, res) => {
    const { nickname } = req.body

    //한글 영문 숫자만 가능
    if(nickname && !validator.matches(nickname, /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]+$/)){
        res.json({
            result: 'not valid'
        })
    }

    const respond = (user) => {
        res.json({
            result: !user ? 'accepted' : 'unaccepted'
        })
    }

    // error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }


    // find the user
    User.findOneByNickname(nickname)
        .then(respond)
        .catch(onError)


}

/*
    GET /api/auth/check
*/
// exports.check = (req, res) => {
//     res.json({
//         success: true,
//         info: req.decoded
//     })
// }
