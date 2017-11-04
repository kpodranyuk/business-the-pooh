var express = require('express');
var router = express.Router();
var db = require('../db/userdb.js');
var dbo = require('../db/commondb.js');

/**
 * Покупка меда(подтверждение)
 */
router.post('/buy-honey', function (req, res) {

	// Купить у пчел мед
	db.buyHoney(req.body.user, req.body.countPots, function(newUserData, comission) {
		res.json({success: true});
	});
	// В коллбеке получить данные о новой операции
	// Вызвать событие, информирующее что у пчел поменялся баланс
	// Вернуть на клиент новые данные о балансе пользователя
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
			if (req.body.productType == 'F' || req.body.productType == 'B') {
				rate = 10;
			}
			else if (req.body.productType == 'P') {
				rate = 5;
			}
			else {
				rate = 1;
			}
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
				honeyToGet: canEnter
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

	res.send("User password update");
});



module.exports = router;