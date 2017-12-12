var mysql = require('mysql');
var con = require("./connection");

/**
 * Получить информацию о текущем курсе товаров
 * @param {function} функция, отправляющая информацию о курсе
 */
function getExchangeRateInfo(callback) {

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
 * Получить информацию о типе пользователя
 * @param {string} userType - тип пользователя
 * @param {function} функция, отправляющая информацию о типе пользователя
 */
function getUserTypeInfo(userType, callback) {
    
}

module.exports.getExchangeRateInfo = getExchangeRateInfo;
module.exports.editProduct = editProduct;
module.exports.getUserTypeInfo = getUserTypeInfo;