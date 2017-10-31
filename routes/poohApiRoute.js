var express = require('express');
var router = express.Router();


/**
 * Операции пользователей за прошлый операционный день
 */
router.post('/last-op-day', function(req, res) {
	
	res.send("Pooh look operations the last day");
});


/**
 * Операции пользователей за прошлый операционный день
 */
router.post('/get-commission', function(req, res) {
	
	res.send("Pooh get commission from users");
});


module.exports = router;