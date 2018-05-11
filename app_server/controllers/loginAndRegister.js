var db = require('../models/model.js');

/**
 * Функция отправки данных на клиент
 * @param {*} res объект ответа на клиент
 * @param {JSON} content js объект который идет на клиент
 */
var sendJSONresponse = function (res, content) {
    res.json(content);
};

module.exports.login = function (req, res) {
    var login = req.body.login;
    db.User.findOne({
        where: { login: login, password: req.body.password }
    }).then(user => {
        if (user != null) {
            db.Purse.findAll({
                where: { loginUser: login },
                attributes: ['amount', 'itemType']
            }).then(purse => {
                sendJSONresponse(res, {
                    ok: true,
                    login: login,
                    purse: purse
                });
            });
        } else {
            sendJSONresponse(res, { ok: false, message: "Пользователь не существует, или введенные данные неверные" });
        }
    }).catch(error => {
        console.log(error);
    });
};


module.exports.register = function (req, res) {
    var login = req.body.login;
    var password = req.body.password;
    db.User.findOne({
        where: { login: login, password: password }
    }).then(user => {
        if (user == null) {
            db.User.create({ login: login, password: password })
                .then(() => {
                    db.Purse.bulkCreate([
                        { amount: 0, itemType: 'ruble', loginUser: login },
                        { amount: 0, itemType: 'honey', loginUser: login },
                        { amount: 0, itemType: 'flower', loginUser: login },
                        { amount: 0, itemType: 'pot', loginUser: login },
                        { amount: 0, itemType: 'balloon', loginUser: login }
                    ]).then(() => {
                        sendJSONresponse(res, {
                            ok: true,
                            login: login,
                            purse: [
                                { amount: 0, itemType: 'ruble' },
                                { amount: 0, itemType: 'honey' },
                                { amount: 0, itemType: 'flower' },
                                { amount: 0, itemType: 'pot' },
                                { amount: 0, itemType: 'balloon' }
                            ]
                        })
                    });
                });
        } else {
            sendJSONresponse(res, { ok: false, message: "Польователь с таким логином существует" });
        }
    })
};
