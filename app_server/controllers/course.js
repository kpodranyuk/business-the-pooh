var db = require('../models/model.js');

/**
 * Функция отправки данных на клиент
 * @param {*} res объект ответа на клиент
 * @param {JSON} content js объект который идет на клиент
 */
var sendJSONresponse = function (res, content) {
    res.json(content);
};

/**
 * Функция получения курса всех товаров
 */
module.exports.getCourse = function (req, res) {
    db.Course.findAll({
        attributes: ['entryProduct', 'countOutputProduct','outputProduct']
    }).then(cur => {
        if (cur != null) {
            sendJSONresponse(res, { ok: true, course:cur});
        } else {
            sendJSONresponse(res, { ok: false, message: "Невозможно получить курс товаров" });
        }
    }).catch(error => {
        console.log(error);
    });
};