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
    var req = $.ajax({
        method: "POST",
        url: '/api/admin/exchange-rate-info',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json', 
        success: function(response){
            console.log(response);
            if(response.success == true){
                // Заполняем данными
                data.productTypes = [];
                for(var i=0; i<response.products.length; i++) {
                    tmpProductType.idProductType = response.products[i].idProductType;
                    tmpProductType.name = response.products[i].name;
                    tmpProductType.type = response.products[i].type;
                    tmpProductType.rate = response.products[i].rate;
                    data.productTypes[data.productTypes.length] = tmpProductType;
                }
                console.log(data);
            } else {
                console.log(response.message);
                callback(response.result, response.success);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ОТПРАВКЕ ЗАПРОСА НА ПОЛУЧЕНИЕ ТИПА ТОВАРОВ");
            console.log(response);
        }
    });
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
    var req = $.ajax({
        method: "POST",
        url: '/api/admin/user-type-info',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json', 
        success: function(response){
            console.log(response);
            if(response.success == true){
                // Заполняем данными
                data.userTypes = [];
                for(var i=0; i<response.userTypes.length; i++) {
                    tmpUserType.productType = response.userTypes[i].productType;
                    tmpUserType.name = response.userTypes[i].name;
                    tmpUserType.isDeleted = response.userTypes[i].isDeleted;
                    data.userTypes[data.userTypes.length] = tmpUserType;
                }
                console.log(data);
            } else {
                console.log(response.message);
                callback(response.result, response.success);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ОТПРАВКЕ ЗАПРОСА НА ПОЛУЧЕНИЕ ТИПА ТОВАРОВ");
            console.log(response);
        }
    });
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