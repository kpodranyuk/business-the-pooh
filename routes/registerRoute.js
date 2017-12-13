var express = require('express');
var router = express.Router();
var db = require('../db/userdb.js');
var dbc = require('../db/commondb');

router.post('/', function (req, res) {

	var login = req.body.login;
	var password = req.body.password;
	var name = req.body.name;
	var userType = req.body.userType;
	if (login == "admin") {
		res.json({ success: false, message: 'Не удалось зарегистрироваться, пользователь с таким логином уже существует' });
	} else {
		db.registrationUser(login, password, name, userType, function (success) {
			if (success == null) {
				res.json({ success: false, message: 'Не удалось зарегистрироваться, пользователь с таким логином уже существует' });
			}
			else {
				// Получить все данные о пользователе и отправить их на клиент
				dbc.getUser(login, function (user) {
					res.json({
						success: true,
						user: user
					});
				});
			}
		});
	}
});

module.exports = router;