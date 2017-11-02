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
            + " AND o.date BETWEEN " + day.startDay.toLocaleString()
            + " AND " + day.endDay.toLocaleString();
        // Если получил
        con.query(sql, function (error, result, fields) {
            if (error) {
                con.commit(function (err) {
                    callback(null);
                    if (err) return con.rollback(function () { console.error(err.message); });
                });
                return con.rollback(function () { console.error(error.message); });
            } else {
                if (result != null) {
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
                        + " AND o.date BETWEEN " + day.startDay.toLocaleString()
                        + " AND " + day.endDay.toLocaleString();

                    // Получить из бд все операции с типом покупка
                    con.query(sql, function (error, result, fields) {
                        if (error) {
                            con.commit(function (err) {
                                callback(null);
                                if (err) return con.rollback(function () { console.error(err.message); });
                            });
                            return con.rollback(function () { console.error(error.message); });
                        }

                        // Отправить пустой список
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

module.exports.getHistoryForLastDay = getHistoryForLastDay;
