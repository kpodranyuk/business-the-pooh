var express = require('express');
var router = express.Router();
var loginAndRegister = require('../controllers/loginAndRegister.js');
var userHistory = require('../controllers/userHistory.js');

router.post('/login', loginAndRegister.login);
router.post('/register', loginAndRegister.register);
router.post('/history', userHistory.history);


module.exports = router;