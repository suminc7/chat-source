const router = require('express').Router()
const controller = require('./user.controller')

router.get('/list', controller.list)
router.get('/profile', controller.profile)
router.post('/like', controller.like)
router.get('/like', controller.getLike)
router.delete('/like', controller.deleteLike)

module.exports = router