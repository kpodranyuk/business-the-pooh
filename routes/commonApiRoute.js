var express = require('express');
var router = express.Router();
var db = require('../db/commondb.js');

/**
 * Все совершенные операции
 */
router.post('/operations', function (req, res) {

	var login = req.body.login;
	db.getAllHistory(login, function (result) {
		if (result == null) {
			res.json({ success: false, message: 'Не удалось получить историю операций данного пользователя' });
		}
		else {
			res.json({
				success: true
			});

			for (var i = 0; i < result.length; i++) {
				var operation = new Operation(
					result[i].idOperation,
					result[i].type,
					result[i].date,
					result[i].idProductType,
					result[i].productAmount,
					result[i].honeyPots,
					result[i].honeyCount,
					result[i].comission
				);

				res.json({
					user: operation
				});

			}
		}
	});

});


/**
 * Вывод меда из системы
 */
router.post('/get-honey', function (req, res) {

	res.send("Get honey User or Pooh");
});


module.exports = router;