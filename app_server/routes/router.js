var express = require('express');
var router = express.Router();
var loginAndRegister = require('../controllers/loginAndRegister.js');

router.post('/login', loginAndRegister.login);


module.exports = router;