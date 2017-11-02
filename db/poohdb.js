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
        var day = new OpeartionDay(new Date());
        var sql = "SELECT * FROM operation o LEFT OUTER JOIN deal d ON o.idOperation = d.idOperation"
            + " where d.loginUser=\"superpooh\" AND  o.type= \"E\""
            + "AND o.date BETWEEN " + day.startDay.toLocalestring()
            + "AND " + day.endDay.toLocalestring();
        // Если получил
        con.query(sql, function (error, result, fields) {
            if (error) {
                callback(null);
                return con.rollback(function () { console.error(error.message); });
            } else {
                if (result != null) {
                    // Отправить пустой список
                    callback(null);
                }
                else {
                    var sql = "SELECT o.date, d.loginUser, o.comission"
                        + "FROM operation o LEFT OUTER JOIN deal d"
                        + " ON o.idOperation = d.idOperation where o.type=\"B\""
                        +  "AND o.date = "+ day.getLastOperationDay().toLocalestring();

                    // Получить из бд все операции с типом покупка
                    con.query(sql, function (error, result, fields) {
                        if (error) {
                            callback(null);
                            return con.rollback(function () { console.error(error.message); });
                        }
                        callback(result);
                        con.commit(function (error) {
                            if (error) return con.rollback(function () { console.error(error.message); });
                        });

                    });
                }
            }
        });
    });
}

module.exports.getHistoryForLastDay = getHistoryForLastDay;
