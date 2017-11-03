var express = require('express');
var router = express.Router();
var path = require('path');

router.post('/', function (req, res) {
	var userLogin = req.body.login;

	if (userLogin != null && userLogin.length > 0) {
		res.sendFile(path.resolve(__dirname + '/../static/resources/userLk.html'));
	}
});

module.exports = router;