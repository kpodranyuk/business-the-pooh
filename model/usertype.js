/**
 * Класс пользователя для модели
 * @param {string} name - логин пользователя 
 * @param {bool} isDeleted - имя пользователя
 */
function UserType(name, isDeleted, productType) {
    this.name = name;
    this.isDeleted = isDeleted;
    this.productType = productType;
}

module.exports = UserType;