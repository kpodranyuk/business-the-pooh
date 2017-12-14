export var data = {
    userTypes: [],
    productTypes: [],
    pots: 0,
    commission: []
};

// буфферные переменные(для удобства)
var tmpUserType = {
    name: "",
    isDeleted: 0,
    productType: 0
};
var tmpProductType = {
    idProductType: 0,
    type: "",
    name: "",
    rate: 0
};


/**
 * Получить все типы продуктов
 * @param {function} callback 
 */
export function getProductTypes(callback) {

}


/**
 * Отредактировать определенный тип товара
 * @param {Object} productType
 * @param {function} callback 
 */
export function editProduct(productType, callback) {
    
}


/**
 * Получить все типы пользователей
 * @param {function} callback 
 */
export function getUserTypes(callback) {
    
}


/**
 * Отредактировать определенный тип пользователя
 * @param {Object} userType
 * @param {function} callback 
 */
export function editUser(userType, callback) {
    
}


/**
 * Удалить определенный тип пользователя
 * @param {Object} userType
 * @param {function} callback 
 */
export function deleteUser(userType, callback) {
    
}


/**
 * Добавить определенный тип пользователя
 * @param {Object} userType
 * @param {function} callback 
 */
export function addUser(userType, callback) {
    
}


/**
 * Получить кол-во горшочков
 * @param {function} callback 
 */
export function getPots(callback) {
    
}

/**
 * Изменить кол-во горшочков
 * @param {function} callback 
 */
export function editPots(callback) {
    
}


/**
 * Получить комиссию
 * @param {function} callback 
 */
export function getCommission(callback) {
    
}


/**
 * Изменить комиссию
 * @param {function} callback 
 */
export function editCommission(callback) {
    
}