/**
 * Класс операционного дня. На входе получает текущую дату
 * @param {Date} date 
 */
function OperationDay(date) {

    // Час начала нового оп. дня
    var DATE_START = 7;
    // Дата начала дня{Date}
    this.startDay = null;
    // Дата завершения дня{Date}
    this.endDay = null;

    /**
     * Получить прошлый операционный день
     * @return {OperationDay} прошлый операционный день
     */
    this.getLastOperationDay = function () {
    };

    /**
     * Входит ли определенная дата в данный операционный день
     * @param {Date} date - дата для проверки вхождения
     * @return {bool} входит или нет
     */
    this.includedOnOperationDay = function (date) {
    }

}