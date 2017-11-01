/**
 * Класс операций
 * @param {number} id - идентификатор операции
 * @param {string} type - тип операции('B','E','G') 
 * 
 */
function Operation(id, type) {
    this.id = id;
    this.type = type;
    this.datatime = null;
    this.productType = "";
    this.productAmount = 0;
    this.honeyPost = 0;
    this.honeyCount = 0;
    this.comission = 0;

}

module.exports = Operation;

