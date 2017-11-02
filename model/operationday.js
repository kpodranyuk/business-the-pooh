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

    // Инициализация полей класса(начала и старта операционного дня)
    var hour = date.getHours();
    if (hour >= DATE_START) {
        this.startDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), DATE_START);

        this.endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), DATE_START);
        this.endDay.setDate(this.endDay.getDate() + 1);
    } else {
        this.startDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), DATE_START);
        this.startDay.setDate(this.startDay.getDate() - 1);

        this.endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), DATE_START);
    }

    /**
     * Получить прошлый операционный день
     * @return {OperationDay} прошлый операционный день
     */
    this.getLastOperationDay = function () {
        var tmp = new Date();
        tmp.setDate(this.startDay.getDate() - 1);
        return new OperationDay(tmp);
    };

    /**
     * Входит ли определенная дата в данный операционный день
     * @param {Date} date - дата для проверки вхождения
     * @return {bool} входит или нет
     */
    this.includedOnOperationDay = function (date) {
        if (this.startDay.valueOf() <= date.valueOf() && date.valueOf() <= this.endDay.valueOf())
            return true;
        else
            return false;
    }

}