var express = require('express');
var router = express.Router();
var loginAndRegister = require('../controllers/loginAndRegister.js');
var buy = require('../controllers/buy.js')
var userHistory = require('../controllers/userHistory.js');
var userRating = require('../controllers/userRating.js');
router.post('/login', loginAndRegister.login);
router.post('/register', loginAndRegister.register);
router.post('/buy', buy.buy);
router.post('/history', userHistory.history);
router.post('/rating', userRating.rating);


module.exports = router;