/**
 * Класс пользователя для модели
 * @param {string} login - логин пользователя 
 * @param {string} name - имя пользователя
 * @param {string} productType - тип продукта('F','B','P','H')
 */
function User(login, name, productType) {
    this.login = login;
    this.name = name;
    this.productType = productType;
    this.productAmount = 0;
    this.honeyAmount = 0;
    this.promotion = null;
}

module.exports = User;

