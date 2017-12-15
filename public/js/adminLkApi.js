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
                data.productTypes = response.products;
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
                data.userTypes = response.userTypes;
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
 * @param {string} userType - текущее название типа пользователя
 * @param {string} newUserType - новое название типа
 * @param {number} idProduct - айдишник
 * @param {function} callback 
 */
export function editUser(userType, newUserType, idProduct, callback) {
    var req = $.ajax({
        method: "POST",
        url: '/api/admin/user-type-edit',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
            userType: userType,
            newUserType: newUserType,
            idProduct: idProduct
        },
        success: function(response){
            console.log(response);
            if(response.success == true){
                callback(response.success);// сообщаем об успешности
            } else {
                console.log(response.message);
                callback(response.success, response.message);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ОТПРАВКЕ ЗАПРОСА НА РЕДАКТИРОВАНИЕ ТИПА ПОЛЬЗОВАТЕЛЯ");
            console.log(response);
        }
    });
}


/**
 * Удалить определенный тип пользователя
 * @param {string} userType - удаляемый тип пользователя
 * @param {function} callback 
 */
export function deleteUser(userType, callback) {
    var req = $.ajax({
        method: "POST",
        url: '/api/admin/user-type-delete',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
            userType: userType
        },
        success: function(response){
            console.log(response);
            if(response.success == true){
                callback(response.success);// сообщаем об успешности
            } else {
                console.log(response.message);
                callback(response.success, response.message);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ОТПРАВКЕ ЗАПРОСА НА УДАЛЕНИЕ ТИПА ПОЛЬЗОВАТЕЛЯ");
            console.log(response);
        }
    });
}


/**
 * Добавить определенный тип пользователя
 * @param {string} userType - название типа пользователя
 * @param {number} idProduct - тип товара
 * @param {function} callback 
 */
export function addUser(userType, idProduct, callback) {
    var req = $.ajax({
        method: "POST",
        url: '/api/admin/user-type-add',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
            userType: userType,
            idProduct: idProduct
        },
        success: function(response){
            console.log(response);
            if(response.success == true){
                callback(response.success);// сообщаем об успешности
            } else {
                console.log(response.message);
                callback(response.success, response.message);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ОТПРАВКЕ ЗАПРОСА НА ДОБАВЛЕНИЕ ТИПА ПОЛЬЗОВАТЕЛЯ");
            console.log(response);
        }
    });
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
export function editCommission(startDInput, secondDInput, thirdDInput, callback) {
    var req = $.ajax({
        method: "POST",
        url: '/api/admin/edit-commission',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
            startDInput: startDInput,
            secondDInput: secondDInput,
            thirdDInput: thirdDInput
        }, 
        success: function(response){
            console.log(response);
            if(response.success == true){
                // Заполняем данными
                data.commission = [startDInput, secondDInput, thirdDInput];
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