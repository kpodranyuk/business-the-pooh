var express = require('express');
var router = express.Router();
var db = require('../db/userdb.js');
var dbo = require('../db/commondb.js');
var Operation = require('../model/operation');
var User = require("../model/usermodel");
var Promotion = require('../model/promotion');

/**
 * Покупка меда(подтверждение)
 */
router.post('/buy-honey', function (req, res) {

	var parsedUser = JSON.parse(req.body.user);
	var user = new User(parsedUser.login, parsedUser.name, parsedUser.productType);	
	user.password = parsedUser.password;
	user.productAmount = parsedUser.productAmount;
	user.honeyAmount = parsedUser.honeyAmount;
	user.promotion = new Promotion(parsedUser.promotion.id);
	user.promotion.operationsCount =  parsedUser.promotion.operationsCount;
	user.promotion.percent = parsedUser.promotion.percent;
	user.promotion.operationsToNext = parsedUser.promotion.operationsToNext;

	// Купить у пчел мед
	db.buyHoney(user, req.body.countPots, function(newUserData, comission) {
		if (newUserData == null) {
			res.json({success: false});
		} else {
			// Вызвать событие, информирующее что у пчел поменялся баланс
			req.io.sockets.emit('buy-honey', {username : parsedUser.login});
			// Вставить новую операцию
			var operation = new Operation(1, 'B', new Date(), newUserData.productType, getRate(newUserData.productType) * req.body.countPots, req.body.countPots, +((req.body.countPots*0.25).toFixed(5)), comission);
			dbo.insertNewOperation(operation, newUserData.login, function(success) {
				if (success) {
					res.json({
						success: true,
						user: newUserData
					});
				}
			});
		}
	});
});


/**
 * Покупка меда(информация при покупке)
 */
router.post('/buy-honey-info', function (req, res) {

	//res.send("User buy honey(info)");
	db.getInformationForBuying(function (result) {
		if (result == null) {
			res.json({ success: false, message: 'Не удалось получить количество доступного мёда у пчёл' });
		}
		else {
			var potsCount = result[0].potsCount;
			var productCount = req.body.productAmount;
			var rate = 0;
			var count = 0;

			// Узнать курс по продукту
			rate = getRate(req.body.productType);
			// Проверить сколько горшочков мёда можно купить
			var canBuy = potsCount - productCount / rate;
			if (canBuy > 0) {
				canBuy = productCount / rate;
			}
			else {
				canBuy = potsCount;
			}
			// Записать в файл джейсон
			res.json({
				success: true,
				honeyToBuy: canBuy - (canBuy % 1) // Убрать возможный остаток
			});
		}
	});
});

/**
 * Получить курс по меду
 * @param {string} productType - тип продукта
 */
function getRate(productType) {
	if (productType == 'F' || productType == 'B') {
		return 10;
	}
	else if (productType == 'P') {
		return 5;
	}
	else {
		return 1;
	}
}


/**
 * Вывод баланса пользователя
 */
router.post('/get-balance', function (req, res) {

	// Получаем логин пользователя
	var login = req.body.login;

	dbo.getUserBalance(login, function (result) {
		if (result == null) {
			res.json({ success: false, message: 'Не удалось получить баланс пользователя' });
		}
		else {
			// Выводим баланс пользователя
			res.json({
				success: true,
				productAmount: result[0].productAmount,
				honeyAmount: result[0].honeyAmount,
				idProductType: result[0].idProductType
			});
		}

	});
});


/**
 * Ввод своего товара в систему
 */
router.post('/entry-product', function (req, res) {

	// res.send("User entry product");
	// Получаем логин пользователя
	var login = req.body.login;
	// Получаем желаемое для ввода количество товара
	var product = req.body.product;
	// Тип товара
	var type = req.body.productType;
	// Говорим БД обновить данные пользователя
	db.enterUserProduct(login, product, function (result) {
		if (result == null) {
			res.json({ success: false, message: 'Не удалось ввести товар для данного пользователя' });
		}
		else if (result.affectedRows == 0) {
			//console.log(result);
			res.json({
				success: false,
				message: 'Запись пользователя не была найдена'
			});
		}
		else {
			dbo.insertNewOperation(new Operation(0,'E',new Date(),type,product,0,0,0), login, function(success){
				if (success) {
					dbo.getUserBalance(login, function (result) {
						if (result == null) {
							res.json({ success: false, message: 'Не удалось получить баланс пользователя' });
						}
						else {
							// Выводим баланс пользователя
							res.json({
								success: true,
								productAmount: result[0].productAmount,
								honeyAmount: result[0].honeyAmount,
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
 * Ввод своего товара в систему(информация)
 */
router.post('/entry-product-info', function (req, res) {

	// res.send("User entry product(info)");
	// Получаем логин пользователя
	var login = req.body.login;
	// Получаем у БД информацию об уже введенных средствах за сегодня
	db.getTodaysEnterOperations(login, function (result) {
		if (result == null) {
			res.json({ success: false, message: 'Не удалось получить историю операций за текущий день у данного пользователя' });
		}
		else {
			// console.log(result);

			var entered = 0;	// Количество введенного товара в систему за сегодня
			var canEnter = 0;	// Максимально возможное количество товара для ввода
			// Для каждой операции..				
			for (var i = 0; i < result.length; i++) {
				// Вычисляем сколько уже было введенно
				entered += result[i].productAmount;
			}
			// Определить допустимое количество товара для ввода - в сумме за день не более 50 шт
			if (entered >= 50) {
				canEnter = 0;
			}
			else {
				canEnter = 50 - entered;
			}
			res.json({
				success: true,
				productToEnter: canEnter
			});
		}
	});
});


/**
 * Деактивация аккаунта
 */
router.post('/deactivate-account', function (req, res) {

	res.send("User deactivate account");
});


/**
 * Обновление пароля
 */
router.post('/password-update', function (req, res) {

	db.updatePassword(req.body.login, req.body.newPassword, function(success){
		if (success) {
			res.json({
				success: true
			});
		} else {
			res.json({
				success: false,
				message: "Не удалось обновить пароль пользователя"
			});
		}
	});
});



module.exports = router;