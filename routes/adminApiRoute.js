var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../db/admindb.js');

/**
 * Получение информации о текущем курсе товаров
 */
router.post('/exchange-rate-info', function (req, res) {
  
	db.getExchangeRateInfo( function (result) {
		if (result == null) {
			res.json({ success: false, message: 'Не удалось получить информацию о текущем курсе товаров' });
		}
		else {
			res.json({
				success: true,
				products: result
			});
		}
	});

});


/**
 * Отредактировать товар
 */
router.post('/edit-product', function (req, res) {

});


/**
 * Получить информацию о всех типах пользователей
 */
router.post('/user-type-info', function (req, res) {

});


/**
 * Отредактировать определенный тип пользователя
 */
router.post('/user-type-edit', function (req, res) {

});


/**
 * Удалить определенный тип пользователя
 */
router.post('/user-type-delete', function (req, res) {
    
});


/**
 * Добавить определенный тип пользователя
 */
router.post('/user-type-add', function (req, res) {
    
});


/**
 * Редактирование кол-ва выпускаемого пчелами меда в сутки
 */
router.post('/edit-pots-count', function (req, res) {
    
});


/**
 * Редактирование системы поощерения для новых пользователей
 */
router.post('/edit-promotion', function (req, res) {
    
});


module.exports = router;