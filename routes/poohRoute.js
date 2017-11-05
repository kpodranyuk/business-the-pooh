var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function (req, res) {

	res.sendFile(path.resolve(__dirname + '/../static/resources/poohLk.html'));
	/*var userLogin = req.body.login;

	if (userLogin != null && userLogin.length > 0) {
		
	}*/
});

module.exports = router;