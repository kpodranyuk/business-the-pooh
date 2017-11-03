var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
	var userLogin = req.body.login;

	if (userLogin != null && userLogin.length > 0) {
		res.sendFile(__dirname + '/../static/resources/userLk.html');
	}
});

module.exports = router;