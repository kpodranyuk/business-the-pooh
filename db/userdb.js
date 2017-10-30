var mysql = require('mysql');
var config = require('./config');

var con = mysql.createConnection({
    host: config[host],
    user: config[user],
    password: config[password],
    database: config[database]
});


/**
 * Зарегистрировать нового пользователя
 * @param {login} логин пользователя
 * @param {password} пароль пользователя
 * @param {name} имя пользователя
 * @param {type} тип пользователя
 * @return {User} созданный пользователь
 */
function registrationUser(login, password, name, type) {

}

module.exports.registrationUser = registrationUser;