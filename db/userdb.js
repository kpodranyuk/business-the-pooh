var mysql = require('mysql');
var config = require('./config');

var con = mysql.createConnection({
    host: config[host],
    port: config[port],
    user: config[user],
    password: config[password],
    database: config[database]
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