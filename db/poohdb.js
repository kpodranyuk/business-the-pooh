var mysql = require('mysql');
var config = require('./config');
var OperationDay = require('../model/operationday');

var con = mysql.createConnection({
    host: config["host"],
    port: config["port"],
    user: config["user"],
    password: config["password"],
    database: config["database"]
});

con.connect(function (error) {
    if (error) {
        console.log("Не удалось подключиться к БД");
    } else {
        console.log("Удалось подключиться к БД");
    }
});

/**
 * Получить историю операций за прошлый день
 * @param {function} функция, отправляющая историю пользователей за прошедший операционный день
 */
function getHistoryForLastDay(callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (err) {
        if (err) { throw err; }


        // Проверить получил ли пух зарплату за текущий оп день
        var day = new OperationDay(new Date());
        var sql = "SELECT * FROM operation o LEFT OUTER JOIN deal d ON o.idOperation = d.idOperation"
            + " where d.loginUser=\"superpooh\" AND o.type= \"E\""
            + " AND o.date BETWEEN " + mysql.escape(day.startDay.toLocaleString())
            + " AND " + mysql.escape(day.endDay.toLocaleString());
        // Если получил
        con.query(sql, function (error, result, fields) {
            if (error) {
                con.commit(function (err) {
                    callback(null);
                    if (err) return con.rollback(function () { console.error(err.message); });
                });
                return con.rollback(function () { console.error(error.message); });
            } else {
                if (result.length != 0) {
                    // Отправить пустой список
                    con.commit(function (err) {
                        callback(null);
                        if (err) return con.rollback(function () { console.error(err.message); });
                    });
                }
                else {
                    day = day.getLastOperationDay();
                    var sql = "SELECT o.date, d.loginUser, o.comission"
                        + " FROM operation o LEFT OUTER JOIN deal d"
                        + " ON o.idOperation = d.idOperation where o.type=\"B\""
                        + " AND o.date BETWEEN " + mysql.escape(day.startDay.toLocaleString())
                        + " AND " + mysql.escape(day.endDay.toLocaleString());

                    // Получить из бд все операции с типом покупка
                    con.query(sql, function (error, result, fields) {
                        if (error) {
                            con.commit(function (err) {
                                callback(null);
                                if (err) return con.rollback(function () { console.error(err.message); });
                            });
                            return con.rollback(function () { console.error(error.message); });
                        }

                        // Отправить список
                        con.commit(function (err) {
                            callback(result);
                            if (err) return con.rollback(function () { console.error(err.message); });
                        });

                    });
                }
            }
        });
    });
}


/**
 * Снять комиссию с пользователей
 * @param {number} balance - текущий баланс Пуха
 * @param {Promotion} promotion - текущая программа поощерения Пуха
 * @param {function} функция, отправляющая Пуху его баланс
 */
function getCommission(balance, promotion, callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (err) {
        if (err) { throw err; }

        // Вытаскиваем из БД пользователей, текущий баланс, и комиссию(сумму) за прошлый оп. день
        var day = new OperationDay(new Date());
        day = day.getLastOperationDay().getLastOperationDay().getLastOperationDay();
        var sql = "SELECT u.login, u.honeyAmount, SUM(o.comission) as comission FROM ((deal d"
            + " LEFT OUTER JOIN operation o ON d.idOperation = o.idOperation)"
            + " LEFT OUTER JOIN  user u ON d.loginUser = u.login)"
            + " WHERE o.type=\"B\" AND o.date BETWEEN " + mysql.escape(day.startDay.toLocaleString())
            + " AND " + mysql.escape(day.endDay.toLocaleString())
            + " GROUP BY u.login"
        con.query(sql, function (error, result, fields) {
            if (error) {
                con.commit(function (err) {
                    callback(null);
                    if (err) return con.rollback(function () { console.error(err.message); });
                });
                return con.rollback(function () { console.error(error.message); });
            } else {
                // Почтитать сколько литров досталось Пуху а сколько пчелам
                var sumCommission = 0;
                for(var i = 0; i < result.length; i++) {
                    sumCommission += result[i].comission;
                }
                var poohZP = sumCommission * (promotion.percent / 100);
                var beeZP = sumCommission - poohZP;
                var dateOperation = null;
                console.log(sumCommission);
                console.log(poohZP);
                console.log(beeZP);

                // Для каждого пользователя обновляем его баланс
                for(var i =0; i < result.length; i++) {
                    var login = result[i].login;

                    con.query("UPDATE user SET honeyAmount = "+ (result[i].honeyAmount - result[i].comission).toFixed(5) +" WHERE login = " + mysql.escape(login), function(error, result, fields) {
                        if(error) console.log(error.message);
                        console.log("update balance user: " + login);
                    });
                }

                // Обновляем баланс Пуха
                con.query("UPDATE user SET honeyAmount=honeyAmount+" + poohZP.toFixed(5) + " WHERE login=\"superpooh\"", function(error, result, fields) {
                    if(error) console.log(error.message);
                    console.log("Обновился баланс Пуха");
                    dateOperation = new Date();
                });

                // Обновляем баланс Пчел
                con.query("UPDATE bees SET potsCount=FLOOR((honeyInPot+"+beeZP.toFixed(5)+")/0.25), " + "honeyInPot=honeyInPot+" + beeZP.toFixed(5), function(error, result, fields) {
                    if(error) console.log(error.message);
                    console.log("Обновился баланс Пчел");
                    con.commit(function (err) {
                        if (err) return con.rollback(function () { console.error(err.message); });
                        console.log("Конец транзакции");
                        callback(poohZP, dateOperation);
                    });
                });
            }
        });
    });
}


module.exports.getCommission = getCommission;
module.exports.getHistoryForLastDay = getHistoryForLastDay;
