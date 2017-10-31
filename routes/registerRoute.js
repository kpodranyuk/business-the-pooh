var express = require('express');
var router = express.Router();
var db = require('../db/userdb.js');

router.post('/', function(req, res) {
	
	var login= req.body.login;
	var password = req.body.password;
	var name=req.body.name;
	var product=req.body.productType;
	
	var user=registrationUser(login, password, name, product);
	if(user == null){
		res.json({success: false, message: 'Не удалось зарегистрироваться, пользователь с таким логином уже существует'});
	}
	else
	{
		res.json({
                            success: true,					
							login: user.login,
							name: user.name,
							productType: user.productType,
							productAmount: user.productAmount,
							honeyAmount: user.honeyAmount,
							promotion: [{
									idPromotion: user.promotion.id
								},{
									operationsCount: user.promotion.operationsCount
								},{
									operationsToNext: user.promotion.operationsToNext
								},{
									percent: user.promotion.percent
							}]
                        });
	}
});

module.exports = router;