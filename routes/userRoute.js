var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	
	res.send("Main page user LK");
});

module.exports = router;