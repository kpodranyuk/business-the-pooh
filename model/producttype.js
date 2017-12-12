/**
 * Класс типа продукта
 * @param {string} type 
 * @param {string} name 
 * @param {number} rate 
 */
function ProductType(type, name, rate) {
    this.type = type;
    this.name = name;
    this.rate = rate;
}

module.exports = ProductType;