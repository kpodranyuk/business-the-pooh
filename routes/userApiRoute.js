var express = require('express');
var router = express.Router();


/**
 * Покупка меда(подтверждение)
 */
router.post('/buy-honey', function(req, res) {
	
	res.send("User buy honey(confirm)");
});


/**
 * Покупка меда(информация при покупке: скидка, комиссия и тд)
 */
router.post('/buy-honey-info', function(req, res) {
	
	res.send("User buy honey(info)");
});


/**
 * Ввод своего товара в систему
 */
router.post('/entry-product', function(req, res) {
	
	res.send("User entry product");
});


/**
 * Ввод своего товара в систему(информация)
 */
router.post('/entry-product-info', function(req, res) {
	
	res.send("User entry product(info)");
});


/**
 * Деактивация аккаунта
 */
router.post('/deactivate-account', function(req, res) {
	
	res.send("User deactivate account");
});


/**
 * Обновление пароля
 */
router.post('/password-update', function(req, res) {
	
	res.send("User password update");
});



module.exports = router;