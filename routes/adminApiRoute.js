var express = require('express');
var router = express.Router();
var path = require('path');

/**
 * Получение информации о текущем курсе товаров
 */
router.get('/exchange-rate-info', function (req, res) {
  
	db.getExchangeRateInfo( function (result) {
		if (result == null) {
			res.json({ success: false, message: 'Не удалось получить информацию о текущем курсе товаров' });
		}
		else {
			res.json({
				success: true,
				operations: result
			});
		}
	});

});


/**
 * Отредактировать товар
 */
router.get('/edit-product', function (req, res) {

});


/**
 * Получить информацию о всех типах пользователей
 */
router.get('/user-type-info', function (req, res) {

});


/**
 * Отредактировать определенный тип пользователя
 */
router.get('/user-type-edit', function (req, res) {

});


/**
 * Удалить определенный тип пользователя
 */
router.get('/user-type-delete', function (req, res) {
    
});


/**
 * Добавить определенный тип пользователя
 */
router.get('/user-type-add', function (req, res) {
    
});


/**
 * Редактирование кол-ва выпускаемого пчелами меда в сутки
 */
router.get('/edit-pots-count', function (req, res) {
    
});


/**
 * Редактирование системы поощерения для новых пользователей
 */
router.get('/edit-promotion', function (req, res) {
    
});


module.exports = router;