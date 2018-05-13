var db = require('../models/model.js');

/**
 * Функция отправки данных на клиент
 * @param {*} res объект ответа на клиент
 * @param {JSON} content js объект который идет на клиент
 */
var sendJSONresponse = function (res, content) {
    res.json(content);
};

module.exports.buy = function (req, res) {

    var login = req.body.login;
    var countEntryProduct = req.body.countEntryProduct;
    var entryProduct = req.body.entryProduct;
    var countOutputProduct = req.body.countOutputProduct;
    var outputProduct = req.body.outputProduct;

    db.Purse.findAll({
        where: { loginUser: login },
        attributes: ['amount', 'itemType']
    }).then(purse => {
        var purse = JSON.parse(JSON.stringify(purse));
        // рассчитываем новый кошелек
        for (var i = 0; i < purse.length; i++) {
            if (outputProduct == purse[i].itemType) {
                purse[i].amount += countOutputProduct;
            } else if (entryProduct == purse[i].itemType) {
                purse[i].amount -= countEntryProduct;
            }
        }

        return purse;
    }).then(purse => {
        // обновим кошелек пользователя
        for (var i = 0; i < purse.length; i++) {
            if (outputProduct == purse[i].itemType || entryProduct == purse[i].itemType) {
                db.Purse.update(
                    { amount: purse[i].amount },
                    { where: { [db.op.and]: [{ loginUser: login }, { itemType: purse[i].itemType }] } }
                ).then(() => { });
            }
        }

        // Добавим новую операцию
        var typeOperation;
        if (outputProduct == 'honey')
            typeOperation = 'exchangeForestProductForHoney';
        else if (outputProduct != 'honey' && outputProduct != 'ruble')
            typeOperation = 'exchangeForForestProduct';
        db.Operation.create({
            typeOperation: typeOperation,
            date: new Date(),
            countEntryProduct: countEntryProduct,
            entryProduct: entryProduct,
            countOutputProduct: countOutputProduct,
            outputProduct: outputProduct
        }).then(operation => {
            sendJSONresponse(res, {
                ok: true,
                purse: purse
            });
        });
    });
};