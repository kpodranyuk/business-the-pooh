var model = require('../models/model.js');

/**
 * Функция отправки данных на клиент
 * @param {*} res объект ответа на клиент
 * @param {JSON} content js объект который идет на клиент
 */
var sendJSONresponse = function (res, content) {
    res.json(content);
};

module.exports.login = function (req, res) {
    
};

