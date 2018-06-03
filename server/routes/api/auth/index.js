const router = require('express').Router()
const controller = require('./auth.controller')
// const passport = require('../../../src/passport');

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/check/email', controller.checkEmail)
router.post('/check/nickname', controller.checkNickname)


module.exports = router


// const router = require('express').Router()
// const controller = require('./auth.controller')
// const authMiddleware = require('../../../middlewares/auth')
//
//
// router.post('/register', controller.register)
// router.post('/login', controller.login)
// router.use('/check', authMiddleware)
// router.get('/check', controller.check)
//
//
// module.exports = router