var express = require('express');
var router = express.Router();
var db = require('../db/poohdb.js');
var dbc = require('../db/commondb');
var Operation = require('../model/operation');
var User = require("../model/usermodel");
var Promotion = require('../model/promotion');
var ProductType = require('../model/producttype');
var UserType = require('../model/usertype');


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
	
	var parsedUser = JSON.parse(req.body.user);
	var user = new User(parsedUser.login, parsedUser.name);	
	user.password = parsedUser.password;
	user.productAmount = parsedUser.productAmount;
	user.honeyAmount = parsedUser.honeyAmount;
	user.promotion = new Promotion(parsedUser.promotion.id);
	user.promotion.operationsCount =  parsedUser.promotion.operationsCount;
	user.promotion.percent = parsedUser.promotion.percent;
	user.promotion.operationsToNext = parsedUser.promotion.operationsToNext;
	user.promotion.commission = parsedUser.promotion.commission;

	var productType = new ProductType(parsedUser.userType.productType.type, parsedUser.userType.productType.name, parsedUser.userType.productType.rate);
	
	user.userType = new UserType(parsedUser.userType.name, parsedUser.userType.isDeleted, productType);

	console.log(user);

	db.getCommission(user, function (poohZP, dateOperation, userUp) {

		if (dateOperation == null) {
			res.json({
				success: false,
				balance: req.body.balance,
				poohZP: 0
			});
		} else {
			global.getComissionToday = true;
			// Вызвать событие, информирующее что Пух снял комиссию
			req.io.sockets.emit('get-comission', {});
			// Сформировать новую операцию
			var operation = new Operation(0, 'E', dateOperation, 'H', 0, 0, poohZP, 0);
			dbc.insertNewOperation(operation, "superpooh", function (success) {

				var balance = req.body.balance + poohZP;
				res.json({
					success: success,
					balance: balance,
					poohZP: poohZP,
					user: userUp
				});
			});
		}
	});
});


module.exports = router;