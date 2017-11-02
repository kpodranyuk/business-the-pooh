var mysql = require('mysql');
var config = require('./config');

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
 * @param {string} loginUser - логин пользователя
 * @param {function} функция, отправляющая историю пользователей за прошедший операционный день
 */
function getHistoryForLastDay(loginUser, callback) {
}

module.exports.getHistoryForLastDay = getHistoryForLastDay;