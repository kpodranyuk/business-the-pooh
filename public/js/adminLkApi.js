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
                callback(data.productTypes);
            } else {
                console.log(response.message);
                callback(response.success);
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
 * @param {number} idProduct
 * @param {string} newName
 * @param {number} rate
 * @param {function} callback 
 */
export function editProduct(idProduct, newName, rate, callback) {
    var req = $.ajax({
        method: "POST",
        url: '/api/admin/edit-product',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
            idProduct: idProduct,
            newName: newName,
            rate: rate
        },
        success: function(response){
            console.log(response);
            if(response.success == true){
                callback(response.success);
            } else {
                console.log(response.message);
                callback(response.success, response.message);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ОТПРАВКЕ ЗАПРОСА НА ПОЛУЧЕНИЕ ТИПА ТОВАРОВ");
            console.log(response);
        }
    });
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
                callback(data.userTypes);
            } else {
                console.log(response.message);
                callback(response.success);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ОТПРАВКЕ ЗАПРОСА НА ПОЛУЧЕНИЕ ТИПА ПОЛЬЗОВАТЕЛЕЙ");
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
    var req = $.ajax({
        method: "POST",
        url: '/api/admin/pots-count-info',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json', 
        success: function(response){
            console.log(response);
            if(response.success == true){
                // Заполняем данными
                data.pots = response.pots;
                console.log(data);
                callback(data.pots);// отсылаем кол-во горшков
            } else {
                console.log(response.message);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ОТПРАВКЕ ЗАПРОСА НА ПОЛУЧЕНИЕ ГОРШОЧКОВ");
            console.log(response);
        }
    });
}

/**
 * Изменить кол-во горшочков
 * @param {number} pots
 * @param {function} callback 
 */
export function editPots(pots, callback) {
    var req = $.ajax({
        method: "POST",
        url: '/api/admin/edit-pots-count',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
            pots: pots
        }, 
        success: function(response){
            console.log(response);
            if(response.success == true){
                // Заполняем данными
                data.pots = pots;
                console.log(data);
                callback(response.success);// отсылаем успешность
            } else {
                console.log(response.message);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ОТПРАВКЕ ЗАПРОСА НА ИЗМИНЕНИЕ ГОРШОЧКОВ");
            console.log(response);
        }
    });
}


/**
 * Получить комиссию
 * @param {function} callback 
 */
export function getCommission(callback) {
    var req = $.ajax({
        method: "POST",
        url: '/api/admin/commission-info',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json', 
        success: function(response){
            console.log(response);
            if(response.success == true){
                // Заполняем данными
                data.commission = response.comission;
                console.log(data);
                callback(data.commission);// отсылаем список комиссий
            } else {
                console.log(response.message);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ОТПРАВКЕ ЗАПРОСА НА ПОЛУЧЕНИЕ КОМИССИИ");
            console.log(response);
        }
    });
}


/**
 * Изменить комиссию
 * @param {mass} commission
 * @param {function} callback 
 */
export function editCommission(commission ,callback) {
    var req = $.ajax({
        method: "POST",
        url: '/api/admin/edit-commission',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
            commission: commission
        }, 
        success: function(response){
            console.log(response);
            if(response.success == true){
                // Заполняем данными
                data.commission = commission;
                console.log(data);
                callback(response.success);// отсылаем успешность
            } else {
                console.log(response.message);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ОТПРАВКЕ ЗАПРОСА НА ИЗМИНЕНИЕ КОМИССИИ");
            console.log(response);
        }
    });
}