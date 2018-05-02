var express = require('express');
var router = express.Router();
var loginAndRegister = require('../controllers/loginAndRegister.js');

router.post('/login', loginAndRegister.login);
router.post('/register', loginAndRegister.register);


module.exports = router;