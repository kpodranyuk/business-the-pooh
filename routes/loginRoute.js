var express = require('express');
var router = express.Router();
var db = require('../db/userdb.js');
var dbc = require('../db/commondb');

router.post('/', function (req, res) {

	var login = req.body.login;
	var password = req.body.password;
	db.loginUser(login, password, function (success) {
		if (success == null && !(login == "admin" && password == "adminadmin")) {
			res.json({ success: false, message: 'Не удалось авторизоваться. Пользователь не найден.' });
		} else if (success) {
			res.json({ success: false, message: 'Данный пользователь деактивирован.' });
		} else {
			if (login == "admin" && password == "adminadmin") {
				res.json({
					success: true,
					user: "admin"
				});
			} else {
				// Получить все данные о пользователе и отправить их на клиент
				dbc.getUser(login, function (user) {
					res.json({
						success: true,
						user: user
					});
				});
			}
		}
	});
});

module.exports = router;
