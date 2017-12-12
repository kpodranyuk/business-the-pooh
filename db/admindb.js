var mysql = require('mysql');
var con = require("./connection");

/**
 * Получение информации о текущем курсе товаров
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

module.exports.editProduct = editProduct;
module.exports.getExchangeRateInfo = getExchangeRateInfo;