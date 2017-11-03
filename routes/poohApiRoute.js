var express = require('express');
var router = express.Router();
var db = require('../db/poohdb.js');


/**
 * Операции пользователей за прошлый операционный день
 */
router.post('/last-op-day', function (req, res) {
	db.getHistoryForLastDay(function (result) {
		if (result == null) {
			res.json({ success: true });
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
	db.getCommission(req.body.balance, req.body.promotion, function (poohZP, dateOperation) {
		res.json({
			poohZP: poohZP,
			dateOperation: dateOperation
		});
	});
});


module.exports = router;