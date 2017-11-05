export function sayHiGuest() {
    //alert("Hello, Guest!");
};

/**
 * Отправить на сервер запрос о регистрации пользователя
 */
export function sendRegist(){
    // Формируем запрос
    var req = $.ajax({
        method: "POST",
        url: '/register',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
            login : $("#regInputLogin").val(),
            password : $("#regInputPassRepeat").val(),
            name : $("#regInputName").val(),
            productType : convertUserTypeToString()
        },   
        success: function(response){
            if(response.success == true){
                console.log("ПОЛЬЗОВАТЕЛЬ ЗАРЕГИСТРИРОВАН!!!");
                // Запоминаем пользователя в браузере
                localStorage.currentUser = JSON.stringify(response.user);
            }
            else{
                console.log(response.message);
                // TODO сделать вывод сообщения в поле под логином
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ РЕГИСТРАЦИИ");
            console.log(response);
        }, 
        complete: function(){

        }        
    });
}

/**
 * Конвертировать выбранный пользователем тип для хранения в БД
 */
function convertUserTypeToString(){
    var val = $("#userType").val();
    if (val == "rabbit")
        return "F";
    if (val == "owl")
        return "P";
    if (val == "pig")
        return "B";
}


/**
 * Залогинить пользователя
 */
export function logIn() {
    // Запрос
    var req = $.ajax({
        method: "POST",
        url: '/login',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',
        data: {
            login : $("#enterInputLogin").val(),
            password : $("#enterInputPass").val()
        },   
        success: function(response){
            if(response.success == true) {
                console.log("ПОЛЬЗОВАТЕЛЬ ВОШЕЛ В СИСТЕМУ!!!");
                // Запоминаем пользователя в браузере
                localStorage.currentUser = JSON.stringify(response.user);
            } else {
                console.log(response.message);
                // TODO сделать вывод сообщения в поле под логином
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ АВТОРИЗАЦИИ");
            console.log(response);
        }
    });
}