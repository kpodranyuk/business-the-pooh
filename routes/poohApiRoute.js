var express = require('express');
var router = express.Router();
var db = require('../db/poohdb.js');
var dbc = require('../db/commondb');
var Operation = require('../model/operation');


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

		// Сформировать новую операцию
		var operation = new Operation(0, 'E', dateOperation, 'H', 0, 0, poohZP, 0);
		dbc.insertNewOperation(operation, "superpooh", function(success) {
			if(!success) {
				res.json({success: false});
			} else {
				var balance = (req.body.balance + poohZP).toFixed(5);
				// TO DO сделать событие по оповещению пользователей обновить свой баланс 
				res.json({
					success: true,
					balance: balance,
					poohZP: poohZP
				});
			}
		});
	});
});


module.exports = router;