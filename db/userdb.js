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
 * @param {string} login - логин пользователя
 * @param {string} password - пароль пользователя
 * @param {string} name - имя пользователя
 * @param {string} productType - тип продукта пользователя('F','B','P','H')
 * @return {User} созданный пользователь
 */
function registrationUser(login, password, name, productType) {

}




module.exports.registrationUser = registrationUser;