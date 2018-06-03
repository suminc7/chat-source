const router = require('express').Router()
const controller = require('./room.controller')


router.get('/list', controller.list)
router.post('/create', controller.create)
router.get('/search', controller.search)
router.get('/:id', controller.info)
router.put('/:id', controller.update)
router.get('/:id/users', controller.users)

module.exports = router