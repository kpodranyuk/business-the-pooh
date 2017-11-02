var express = require('express');
var router = express.Router();
var db = require('../db/poohdb.js');


/**
 * Операции пользователей за прошлый операционный день
 */
router.post('/last-op-day', function (req, res) {
	db.getHistoryForLastDay(function (result) {
		if (result == null) {
			res.json({ success: false });
		}
		else {
			res.json({
				success: true,
				result: result
			});
		}
	});
});


	/**
	 * Операции пользователей за прошлый операционный день
	 */
	router.post('/get-commission', function (req, res) {

		res.send("Pooh get commission from users");
	});


	module.exports = router;