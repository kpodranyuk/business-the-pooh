export var curUser = [];
curUser = JSON.parse(localStorage.currentUser);

/**
 * Отправить на сервер запрос об обновлении пароля
 */
export function updatePassword(newPassword, callback){
    // Формируем запрос
    if (newPassword == null)
        newPassword = "12345678";
    var req = $.ajax({
        method: "POST",
        url: '/api/user/password-update',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
            login : curUser.login,
            oldPassword : curUser.password,
            newPassword : newPassword
        },   
        success: function(response){
            if(response.success == true){
                console.log("ПАРОЛЬ ОБНОВЛЕН");
                // Запоминаем пользователя в браузере
                curUser.password = newPassword;
                localStorage.currentUser = JSON.stringify(curUser);
                callback(true);
            }
            else{
                console.log(response.message);
                callback(false);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ОБНОВЛЕНИИ ПАРОЛЯ");
            console.log(response);
            callback(false);
        }, 
        complete: function(){

        }        
    });
}

/**
 * Отправить на сервер запрос об информации для покупки меда
 */
export function buyHoneyInfo(callback){
    // Формируем запрос
    var req = $.ajax({
        method: "POST",
        url: '/api/user/buy-honey-info',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
            productAmount : curUser.productAmount,
            productType : curUser.productType
        },   
        success: function(response){
            if(response.success == true){
                console.log("ИНФОРМАЦИЯ ДЛЯ ПОКУПКИ ПОЛУЧЕНА");
                // Возвращаем максимальное количество горшочков для покупки
                callback(response.honeyToBuy);
            }
            else{
                console.log(response.message);
                callback(null);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ПОЛУЧЕНИИ ИНФОРМАЦИИ ДЛЯ ПОКУПКИ");
            console.log(response);
            callback(null);
        }, 
        complete: function(){

        }        
    });
}

/**
 * Отправить на сервер запрос ввода товара
 */
export function enterProduct(amount, callback){
    // Формируем запрос
    var req = $.ajax({
        method: "POST",
        url: '/api/user/entry-product',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
            login : curUser.login,
            product : amount,
            productType : curUser.productType
        },   
        success: function(response){
            if(response.success == true){
                console.log("ТОВАР ВВЕДЕН В СИСТЕМУ");
                curUser.productAmount = response.productAmount;
                localStorage.currentUser = JSON.stringify(curUser);
                callback(true);
            }
            else{
                console.log(response.message);
                callback(false);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ВВОДЕ ТОВАРА");
            console.log(response);
            callback(false);
        }, 
        complete: function(){

        }        
    });
}

/**
 * Отправить на сервер запрос об информации для ввода ТОВАРА
 */
export function enterProductInfo(callback){
    // Формируем запрос
    var req = $.ajax({
        method: "POST",
        url: '/api/user/entry-product-info',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
            login : curUser.login
        },   
        success: function(response){
            if(response.success == true){
                console.log("ИНФОРМАЦИЯ ДЛЯ ВВОДА ТОВАРА ПОЛУЧЕНА");
                // Возвращаем максимальное количество товара для ввода
                callback(response.productToEnter);
            }
            else{
                console.log(response.message);
                callback(null);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ПОЛУЧЕНИИ ИНФОРМАЦИИ ДЛЯ ВВОДА ТОВАРА");
            console.log(response);
            callback(null);
        }, 
        complete: function(){

        }        
    });
}