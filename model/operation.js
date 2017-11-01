/**
 * Класс операций
 * @param {number} id - идентификатор операции
 * @param {string} type - тип операции('B','E','G') 
 * @param {Date} datatime - дата и время совершения операции
 * @param {string} productType - тип продукта('F','B','P','H') 
 * @param {number} productAmount - количество продуктов для обмена
 * @param {number} honeyPots - количество горшочков с мёдом
 * @param {number} honeyCount - количество мёда 
 * @param {number} comission - комиссия
 */
function Operation(id, type, datatime, productType, productAmount, honeyPots, honeyCount, comission) {
    this.id = id;
    this.type = type;
    this.datatime = datatime;
    this.productType = productType;
    this.productAmount = productAmount;
    this.honeyPots = honeyPots;
    this.honeyCount = honeyCount;
    this.comission = comission;

}

module.exports = Operation;

