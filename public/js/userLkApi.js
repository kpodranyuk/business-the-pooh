export var curUser = [];
curUser = JSON.parse(localStorage.currentUser);

/**
 * Отправить на сервер запрос о регистрации пользователя
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