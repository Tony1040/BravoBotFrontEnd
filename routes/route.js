const router = require('express').Router()
const controller = require('../controllers/controller')

router.post('/webhook', controller.checkMethod)

module.exports = router