
export var curUser = JSON.parse(localStorage.currentUser);
console.log(curUser);

/**
 * Отправить на сервер запрос получения операций покупки пользователей за прошлый оп. день
 * @param {function} callback - функция, которая будет получать данные после запроса
 */
export function lastOperationDay(callback) {
    var req = $.ajax({
        method: "POST",
        url: '/api/pooh/last-op-day',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
        },   
        success: function(response){
            if(response.success == true){
                // Передаем пользователей для их отображения
                callback(response.result, response.success);
            } else {
                console.log("Комиссия снята, или произошла какая то ошибка, нет соединения к БД, или не правильный запрос.");
                callback(response.result, response.success);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ОТПРАВКЕ ЗАПРОСА НА ПОЛУЧЕНИЕ ПОЛЬЗОВАТЕЛЕЙ");
            console.log(response);
        }
    });
};


/**
 * Получить все совершенные операции
 * @param {function} callback - функция, которая будет получать данные после запроса
 */
export function getOperations(callback) {
    var req = $.ajax({
        method: "POST",
        url: '/api/common/operations',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
            login: curUser.login
        },   
        success: function(response){
            if(response.success == true){
                // Передаем операции для их отображения
                callback(response.operations);
            } else {
                console.log("Произошла какая то ошибка, нет соединения к БД, или не правильный запрос");
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ОТПРАВКЕ ЗАПРОСА НА ПОЛУЧЕНИЕ ОПЕРАЦИИЙ");
            console.log(response);
        }
    });
};


/**
 * Снять комиссию
 * @param {function} callback - функция, которая будет получать данные после запроса
 */
export function getComission(callback) {
    var req = $.ajax({
        method: "POST",
        url: '/api/pooh/get-commission',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
            balance: curUser.honeyAmount,
            promotion: JSON.stringify(curUser.promotion)
        },   
        success: function(response){
            if(response.success == true){
                // сохраняем в локальный объект все новые данные
                // Передаем операции для их отображения
                curUser.honeyAmount = "";
                curUser.honeyAmount = response.balance;
                localStorage.currentUser = JSON.stringify(curUser);
                callback(response.balance, response.poohZP);
            } else {
                console.log("Произошла какая то ошибка, нет соединения к БД, или не правильный запрос");
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ОТПРАВКЕ ЗАПРОСА НА СНЯТИЕ КОМИССИИ");
            console.log(response);
        }
    });
};