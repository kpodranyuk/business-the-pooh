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

con.connect(function (err) {
    if (err) {
        console.log("Не удалось подключиться к БД");
    } else {
        console.log("Удалось подключиться к БД");
    }
});


/**
 * Получить индекс типа продукта из БД
 * @param {string} productType - тип продукта пользователя('F','B','P','H')
 */
function getIndexProductType(productType) {
    if (productType == 'F')
        return 1;
    else if (productType == 'B')
        return 2;
    else if (productType == 'P')
        return 3;
    else
        return 4;
}

/**
 * Зарегистрировать нового пользователя
 * @param {string} loginUser - логин пользователя
 * @param {string} passwordUser - пароль пользователя
 * @param {string} nameUser - имя пользователя
 * @param {string} productTypeUser - тип продукта пользователя('F','B','P','H')
 * @param {function} функция, отправляющая созданного пользователя
 */
function registrationUser(loginUser, passwordUser, nameUser, productTypeUser, callback) {

    // Начинаем транзакцию 
    con.beginTransaction(function (err) {
        if (err) { throw err; }

        // Смотрим тип продукта
        var type = getIndexProductType(productTypeUser);
        // Вставляем пользователя  
        var values = [[loginUser, passwordUser, nameUser, false, 0, 0, type, 1]];
        var sql = "INSERT INTO User(login, password, name, isAdmin, productAmount, honeyAmount, idProductType, idPromotion) VALUES ";
        con.query(sql + mysql.escape(values), function (error, results, fields) {
            if (error) {
                callback(null);
                return con.rollback(function () { console.error(error.message); });
            } else {
                // Создаем пользователя и скидку для него
                var user = new User(loginUser, nameUser, productTypeUser);
                user.promotion = new Promotion(1);
                user.promotion.operationsToNext = 5;
                user.promotion.percent = 15;
                user.password = passwordUser;
                user.honeyAmount = 0;
                user.productAmount = 0;

                // Вставляем скидки дл нового пользователя
                con.query("INSERT INTO Promotion(operationsCount, operationsToNext, percent) VALUES(0, 5, 15)", function (error, results, fields) {
                    if (error) return con.rollback(function () { console.error(error.message); });

                    user.promotion.id = results.insertId;

                    // Обновляем id скидки у  пользователя и отправляем в коллбек
                    con.query("UPDATE User SET idPromotion = " + user.promotion.id + " WHERE login = " + mysql.escape(user.login), function (error, results, fields) {
                        if (error) return con.rollback(function () { console.error(error.message); });

                        con.commit(function (error) {
                            callback(user);
                            if (error) return con.rollback(function () { console.error(error.message); });
                        });
                    });
                });
            }
        });
    });
}


/**
 * Залогинить пользователя
 * @param {string} login - логин пользователя
 * @param {string} password - пароль пользователя
 * @param {function} функция, отправляющая созданного пользователя
 */
function loginUser(login, password, callback) {

}


module.exports.registrationUser = registrationUser;
module.exports.loginUser = loginUser;