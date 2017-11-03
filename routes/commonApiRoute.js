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

	// res.send("Get honey User or Pooh");
	// Получаем логин пользователя
	var login = req.body.login;
	// Получаем желаемое для снятия количество меда
	var honey = req.body.honey;
	// Говорим БД обновить данные пользователя
	db.withdrawUserHoney(login, honey, function (result) {
		if (result == null) {
			res.json({ success: false, message: 'Не удалось снять мед у данного пользователя' });
		}
		else if (result.affectedRows == 0) {
			//console.log(result);
			res.json({
				success: false,
				message: 'Запись пользователя не была найдена'
			});
		}
		else {
			// console.log(result);
			res.json({
				success: true,
				message: 'Мед был выведен из системы'
			});
		}
	});
});




/**
 * Вывод меда из системы(информация)
 */
router.post('/get-honey-info', function (req, res) {

	// res.send("Get honey User or Pooh info");	
	// Получаем логин пользователя
	var login = req.body.login;
	// Получаем у бд баланс пользователя
	db.getUserBalance(login, function (result) {
		if (result == null) {
			res.json({ success: false, message: 'Не удалось получить баланс данного пользователя' });
		}
		else {
			var honeyCount = result.honeyCount;	// Количество меда у пользователя
			var comissioned = 0;	// Мед "под комиссией" - его нельзя снять
			var canGet = 0;			// Мед, который можно вывести
			var alreadyGot = 0;		// Мед, который уже был выведен за сегодня
			db.getTodaysOperations(login, function (result) {
				if (result == null) {
					res.json({ success: false, message: 'Не удалось получить историю операций за текущий день у данного пользователя' });
				}
				else {
					// Для каждой операции..					
					for (var i = 0; i < result.length; i++) {
						// Определить "комиссионный мед", который трогать нельзя
						comissioned += result[i].comission;
						// Определить количество уже выведенного сегодня меда
						if (result[i].type == 'G')
							alreadyGot += result[i].honeyCount;
					}
					// Определяем свободное количество меда
					canGet = honeyCount - comissioned;
					if (canGet > 5.0) {
						canGet = 5.0;
					}
					// Определить допустимое количество меда для вывода - в сумме за день не более 5л
					if (alreadyGot == 5.0) {
						canGet = 0;
					}
					else if (alreadyGot + canGet >= 5.0) {
						canGet = 5.0 - alreadyGot;
					}
					res.json({
						success: true,
						honeyToGet: canGet
					});
				}
			});
		}
	});
});


module.exports = router;