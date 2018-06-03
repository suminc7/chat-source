const router = require('express').Router()
const passport = require('../../src/passport');
const auth = require('./auth')
const user = require('./user')
const room = require('./room')

router.use('/auth', auth)
router.use('/user', passport.authenticate)
router.use('/user', user)
router.use('/room', passport.authenticate)
router.use('/room', room)

module.exports = router