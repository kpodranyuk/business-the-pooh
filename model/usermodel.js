/**
 * Класс пользователя для модели
 * @param {string} login - логин пользователя 
 * @param {string} name - имя пользователя
 * @param {string} productType - тип продукта('F','B','P','H')
 */
function User(login, name, productType) {
    this.login = login;
    this.password = "";
    this.name = name;
    this.isAdmin = false;
    this.productType = productType;
    this.productAmount = 0;
    this.honeyAmount = 0;
    this.promotion = null;
}

module.exports = User;

