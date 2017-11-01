var mysql = require('mysql');
var config = require('./config');

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
 * Получить историю операций
 * @param {string} loginUser - логин пользователя
 * @param {function} функция, отправляющая историю операций пользователя
 */
function getAllHistory(loginUser, callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (err) {
        if (err) { throw err; }
        var sql = "SELECT * FROM operation o LEFT OUTER JOIN deal d ON o.idOperation = d.idOperation where loginUser=" + login;
        con.query(sql, function (err, result, fields) {

            if (error) {
                callback(null);
                return con.rollback(function () { console.error(error.message); });
            } else {
                con.commit(function (error) {
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
                callback(result);
            }
        });
    });
}