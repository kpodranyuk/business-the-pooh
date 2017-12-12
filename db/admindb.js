var mysql = require('mysql');
var con = require("./connection");

/**
 * Получить информацию о текущем курсе товаров
 * @param {function} функция, отправляющая информацию о курсе
 */
function getExchangeRateInfo(callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (error) {
        if (error) { throw error; }
        // Сделать выборку из БД информации о курсе товаров
        var sql = "Select idProductType,name,rate from producttype where name<>\"Мед\"";
        con.query(sql, function (error, result, fields) {
            if (error) {
                con.commit(function (error) {
                    callback(null);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
                return con.rollback(function () { console.error(error.message); });
            } else {
                con.commit(function (error) {
                    callback(result);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });

            }
        });
    });
}

/**
 * Отредактировать товар
 * @param {string} productName - название товара
 * @param {string} newProductName - новое название товара
 * @param {int} newExchangeRate - новый курс обмена
 * @param {function} функция, отправляющая новую информацию о товаре
 */
function editProduct(productName, newProductName, newExchangeRate, callback) {

}

/**
 * Получить информацию о всех типах пользователей
 * @param {function} функция, отправляющая информацию о всех типах пользователей
 */
function getUserTypesInfo(callback) {

}

module.exports.getExchangeRateInfo = getExchangeRateInfo;
module.exports.editProduct = editProduct;
module.exports.getUserTypesInfo = getUserTypesInfo;