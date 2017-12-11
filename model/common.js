var OperationDay = require('./operationday');
var db = require('../db/commondb');

var currentOperationDay = new OperationDay(new Date());
console.log("Текущий операционный день: начало - " + currentOperationDay.startDay.toLocaleString()
    + ", конец - " + currentOperationDay.endDay.toLocaleString());


/**
* Обновление нового операционного дня
* @param {socket} io - сокет для генерации события что настал новый операционный день 
*/
function updateOperationDay(io) {
    if (!currentOperationDay.includedOnOperationDay(new Date())) {
        currentOperationDay = new OperationDay(new Date());
        console.log("Текущий операционный день: начало - " + currentOperationDay.startDay.toLocaleString()
            + ", конец - " + currentOperationDay.endDay.toLocaleString());

        // Сгенерировать новый мед
        db.generateNewPots(function (success) {
            if (success) {
                console.log("Пчелы выставили на продажу еще 50 баночек меда.");
                io.sockets.emit('new-oper-day', {});
            } else {
                console.log("Пчелы не смогли выставить на продажу новый мед.");
            }
        });
    }
}

/**
 * Получить тип продукта по индексу
 * @param {number} productType - тип продукта пользователя(1,2,3,4)
 */
function getStringProductType(productType) {
    if (productType == 1)
        return "F";
    else if (productType == 2)
        return "B";
    else if (productType == 3)
        return "P";
    else if (productType == 4)
        return "H";
    else
        return null;
}

/**
 * Получить индекс типа продукта из БД
 * @param {string} productType - тип продукта пользователя('F','B','P','H')
 */
function getIndexProductType(productType) {
    if (productType == 'F')
        return 1;
    else if (productType == 'B')
        return 2;
    else if (productType == 'P')
        return 3;
    else
        return 4;
}

module.exports.updateOperationDay = updateOperationDay;
module.exports.getStringProductType = getStringProductType;
module.exports.getIndexProductType = getIndexProductType;