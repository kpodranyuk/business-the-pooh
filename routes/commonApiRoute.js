var express = require('express');
var router = express.Router();


/**
 * Все совершенные операции
 */
router.post('/operations', function(req, res) {
	
	res.send("Operations User or Pooh");
});


/**
 * Вывод меда из системы
 */
router.post('/get-honey', function(req, res) {
	
	res.send("Get honey User or Pooh");
});


module.exports = router;