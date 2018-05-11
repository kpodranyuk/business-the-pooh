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
 * Функция получения операций пользователя
 */
module.exports.history = function (req, res) {
    var login = req.body.login;
    db.Operation.findAll({
        where: { loginUser: login },
        attributes: ['typeOperation', 'date','countEntryProduct','entryProduct','countOutputProduct','outputProduct']
    }).then(operations => {
        if (operations != null) {
            sendJSONresponse(res, { ok: true, oper:operations});
        } else {
            sendJSONresponse(res, { ok: false, message: "Невозможно найти пользователя с таким логином" });
        }
    }).catch(error => {
        console.log(error);
    });
};
