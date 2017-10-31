var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
	
	res.send("Main page pooh LK");
});

module.exports = router;