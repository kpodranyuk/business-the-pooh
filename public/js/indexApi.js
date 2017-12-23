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
            userType : $("#userType").val()
        },   
        success: function(response){
            if(response.success == true){
                console.log("ПОЛЬЗОВАТЕЛЬ ЗАРЕГИСТРИРОВАН!!!");
                // Запоминаем пользователя в браузере
                localStorage.currentUser = JSON.stringify(response.user);
                goToLk(response.user.isAdmin);
            }
            else{
                console.log(response.message);
                // TODO сделать вывод сообщения в поле под логином
                //alert(response.message);
                var loginHelp = document.querySelector("#regloginHelp");
                loginHelp.innerHTML=response.message;
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
                if (response.user == "admin") {
                    window.location = '/adminLk.html';
                } else {
                    goToLk(response.user.isAdmin);
                }
            } else {
                console.log(response.message);
                // TODO сделать вывод сообщения в поле под логином
                //alert(response.message);
                var loginHelp = document.querySelector("#enterloginHelp");
                loginHelp.innerHTML=response.message;
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ АВТОРИЗАЦИИ");
            console.log(response);
        }
    });
}

function goToLk(isAdmin) {
    console.log("LK");
    var url = '';
    if (isAdmin)
        url = '/poohLk.html';
    else 
        url = '/userLk.html';

    window.location = url;
}

/**
 * Подгрузить типов пользователей
 */
export function getUserType() {
    // Запрос
    var req = $.ajax({
        method: "POST",
        url: '/api/admin/user-type-info',
        header: {
            "Content-Type": 'application/json',
        },        
        dataType: 'json',  
        success: function(response){
            if(response.success == true) {
                console.log("получили типов пользователей!!!");
                // Вставляем их в html
                $("#userType").empty();
                for (var i=0; i < response.userTypes.length; i++) {
                    if (!response.userTypes[i].isDeleted) {
                        var o = document.createElement("option");
                        o.value = response.userTypes[i].name;
                        o.innerHTML = response.userTypes[i].name;
                        $("#userType").append(o);
                    }
                }
            } else {
                console.log(response.message);
            }
        },
        error: function(response){
            console.log("ОШИБКА ПРИ ЗАГРУЗКЕ ТИПОВ ПОЛЬЗОВАТЕЛЕЙ");
            console.log(response);
        }
    });
}