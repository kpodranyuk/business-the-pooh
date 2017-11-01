var express = require('express');
var router = express.Router();
var db = require('../db/userdb.js');

router.post('/', function (req, res) {

	var login = req.body.login;
	var password = req.body.password;
	db.loginUser(login, password, function (user) {
		if (user == null) {
			res.json({ success: false, message: 'Не удалось авторизоваться. Пользователь не найден.' });
		}
		else {
			res.json({
				success: true,
				user: user
			});
		}
	});
});
module.exports = router;
