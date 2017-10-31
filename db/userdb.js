var mysql = require('mysql');
var config = require('./config');
var User = require('../model/usermodel');
var Promotion = require('../model/promotion');

var con = mysql.createConnection({
    host: config["host"],
    port: config["port"],
    user: config["user"],
    password: config["password"],
    database: config["database"]
});

con.connect(function(err) {
    if (err) {
        console.log("Не удалось подключиться к БД");
    } else {
        console.log("Удалось подключиться к БД");
    }
});


/**
 * Зарегистрировать нового пользователя
 * @param {string} login - логин пользователя
 * @param {string} password - пароль пользователя
 * @param {string} name - имя пользователя
 * @param {string} productType - тип продукта пользователя('F','B','P','H')
 * @return {User} созданный пользователь
 */
function registrationUser(login, password, name, productType) {
    var user = null;
    var promotion = null;
    // Начинаем транзакцию 
    con.beginTransaction(function(err) {
        if (err) {
            console.error(err);
            throw err;
        }

        // Вставляем скидки дл нового пользователя
        con.query("INSERT INTO Promotion(operationsCount, operationsToNext, percent) VALUES(0, 5, 15)", function(error, results, fields) {
            if (error) {
                return con.rollback(function() {
                    console.error(error);
                    throw error;
                });
            } else {
                promotion = new Promotion(results.insertId);
            }

            var idPromotion = results.insertId;
            var type = 0;
            if (productType == 'F')
                type = 1;
            else if(productType == 'B')
                type = 2;
            else if (productType == 'P')
                type = 3;
            else
                type = 4;

            // Вставляем самого пользователя
            var sql = "INSERT INTO User(login, password, name, isAdmin, productAmount, honeyAmount, idProductType, idPromotion) VALUES ?";
            var values = [login, password, name, false, 0, 0, type, idPromotion];
            con.query(sql, values, function(error, results, fields) {
                if (error) {
                    return con.rollback(function() {
                        console.error(error);
                        throw error;
                    });
                } else {
                    promotion.operationsToNext = 5;
                    promotion.percent = 15;
                    user = new User(login, name, productType);
                    user.password = password;
                    user.promotion = promotion;
                }
            });

        });
    });

    return user;
}


/**
 * Залогинить пользователя
 * @param {string} login - логин пользователя
 * @param {string} password - пароль пользователя
 * @return {User} залогиненный пользователь(null в случае ошибки авторизации)
 */
function loginUser(login, password) {
    
}


module.exports.registrationUser = registrationUser;
module.exports.loginUser = loginUser;