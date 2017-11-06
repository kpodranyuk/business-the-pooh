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
                global.getComissionToday = false;
                io.sockets.emit('new-oper-day', {});
            } else {
                console.log("Пчелы не смогли выставить на продажу новый мед.");
            }
        });
    }
}


module.exports.updateOperationDay = updateOperationDay;