var express = require('express');
var router = express.Router();
var db = require('../db/commondb.js');
var poohDb = require('../db/poohdb');
var Operation = require('../model/operation.js');
var OperationDay = require('../model/operationday');
var common = require('../model/common');

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

			var mass = [];
			for (var i = 0; i < result.length; i++) {
				var operation = new Operation(
					result[i].idOperation,
					result[i].type,
					new Date(result[i].date),
					common.getStringProductType(result[i].idProductType),
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
			db.insertNewOperation(new Operation(0, 'G', new Date(), 'H', 0, 0, honey, 0), login, function (success) {
				if (success) {
					db.getUserBalance(login, function (result) {
						if (result == null) {
							res.json({ success: false, message: 'Не удалось получить баланс пользователя' });
						}
						else {
							// Выводим баланс пользователя
							res.json({
								success: true,
								productAmount: result[0].productAmount,
								honeyAmount: +(result[0].honeyAmount.toFixed(5)),
								idProductType: result[0].idProductType
							});
						}

					});
				}
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
		if (result.length == 0) {
			res.json({ success: false, message: 'Не удалось получить баланс данного пользователя' });
		}
		else {
			var honeyCount = result[0].honeyAmount;	// Количество меда у пользователя
			db.getTodaysOperations(login, function (result) {
				if (result.length == null) {
					res.json({ success: false, message: 'Не удалось получить историю операций за текущий день у данного пользователя' });
				}
				else {
					poohDb.getZPLastDayPooh(function (getZP) {
						if (getZP != null) {

							var comissioned = 0;	// Мед "под комиссией" - его нельзя снять
							var canGet = 0;			// Мед, который можно вывести
							var alreadyGot = 0;		// Мед, который уже был выведен за сегодня
							var opDay = new OperationDay(new Date());
							// Для каждой операции..					
							for (var i = 0; i < result.length; i++) {
								// Определить "комиссионный мед", который трогать нельзя
								if (opDay.includedOnOperationDay(new Date(result[i].date))) {
									comissioned += result[i].comission;
								} else if (getZP == false) {
									comissioned += result[i].comission;
								}
								// Определить количество уже выведенного сегодня меда
								if (result[i].type == 'G' && opDay.includedOnOperationDay(new Date(result[i].date)))
									alreadyGot += result[i].honeyCount;
							}
							// Определяем свободное количество меда
							var freeHoney = +((honeyCount - comissioned).toFixed(5));
							var canGet = 0.0;
							if (alreadyGot == 5.0) {
								canGet = 0.0;
							}
							else {
								if (freeHoney > 5.0) {
									canGet = +((5.0 - alreadyGot).toFixed(5));
								}
								else if (freeHoney < 0) {
									canGet = 0.0;
								}
								else if (freeHoney + alreadyGot >= 5.0) {
									canGet = freeHoney - alreadyGot;
								}
								else {
									canGet = freeHoney;
								}
							}
							res.json({
								success: true,
								honeyToGet: canGet
							});
						} else {
							res.json({ success: false, message: 'Не удалось получить баланс данного пользователя' });
						}
					});
				}
			});
		}
	});
});


module.exports = router;