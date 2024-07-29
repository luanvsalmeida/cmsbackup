var express = require('express');
var router = express.Router();

const loginController = require('../controllers/loginController')

router.get('/', loginController.homePage);

router.get('/login', loginController.index);

router.get('/logout',loginController.logout)

router.post('/login', loginController.login);

module.exports = router;