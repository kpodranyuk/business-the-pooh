
export var curUser = JSON.parse(localStorage.currentUser);
console.log(curUser);

/**
 * Отправить на сервер запрос получения операций покупки пользователей за прошлый оп. день
 * @param {function} callback - функция, которая будет получать данные после запроса
 */
export function lastOperationDay(callback) {
    console.log("Операции за прошлый операционный день");
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
                callback(response.result);
            } else {
                console.log("Произошла какая то ошибка, нет соединения к БД, или не правильный запрос");
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
    console.log("Операции за все время");
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