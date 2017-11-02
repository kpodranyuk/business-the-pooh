var express = require('express');
var router = express.Router();
var db = require('../db/commondb.js');
var Operation = require('../model/operation.js');
/**
 * Все совершенные операции
 */
router.post('/operations', function (req, res) {

	/**
	 * Получить тип продукта по индексу
	 * @param {number} productType - тип продукта пользователя(1,2,3,4)
	 */
	function getStringProductType(productType) {
		if (productType == 1)
			return "F";
		else if (productType == 2)
			return "B";
		else if (productType == 3)
			return "P";
		else if (productType == 4)
			return "H";
		else
			return null;
	}

	var login = req.body.login;
	db.getAllHistory(login, function (result) {
		if (result == null) {
			res.json({ success: false, message: 'Не удалось получить историю операций данного пользователя' });
		}
		else {

			var mass = [];
			for (var i = 0; i < result.length; i++) {
				var operation = new Operation(
					result[i].idOperation,
					result[i].type,
					new Date(result[i].date),
					getStringProductType(result[i].idProductType),
					result[i].productAmount,
					result[i].honeyPots,
					result[i].honeyCount,
					result[i].comission
				);
				mass[mass.length] = operation;
			}
			res.json({
				success: true,
				operations: mass
			});
		}
	});

});


/**
 * Вывод меда из системы
 */
router.post('/get-honey', function (req, res) {

	res.send("Get honey User or Pooh");
});


/**
 * Вывод меда из системы(информация)
 */
router.post('/get-honey-info', function (req, res) {

	res.send("Get honey User or Pooh info");
});



module.exports = router;