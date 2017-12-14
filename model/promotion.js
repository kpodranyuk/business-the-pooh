/**
 * Класс скидки
 * @param {number} id - идентификатор скидки 
 */
function Promotion(id) {
    this.id = id;
    this.operationsCount = 0;
    this.percent = 0;
    this.operationsToNext = 0;
    this.commission = null;
}

module.exports = Promotion;