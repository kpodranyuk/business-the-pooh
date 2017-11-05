import * as indexApi from "./indexApi.js";

// enterSubmit - "Войти в систему"
var enterBttn = document.querySelector("#enterSubmit");
enterBttn.onclick=function(event){
    // Проверить логин
    // enterInputLogin - инпут логина при входе
    var login = document.querySelector("#enterInputLogin");
    // enterloginHelp - подпись под инпутом логина при входе
    var loginHelp = document.querySelector("#enterloginHelp");
    var wasPapaProud = false;
    wasPapaProud = isCorrectLogin(login.value, loginHelp);
    makePapaProud(login.parentNode, wasPapaProud);

    // Проверить пароль
    // enterInputPass - инпут пароля при входе
    var passwd = document.querySelector("#enterInputPass");
    // enterpassHelp - подпись под инпутом пароля при входе
    var passwdHelp = document.querySelector("#enterpassHelp");
    wasPapaProud = wasPapaProud && makePapaProud(passwd.parentNode, isCorrectPassword(passwd.value, passwdHelp));
    if(!wasPapaProud)
        return false;
}

// agreeCheck - "Согласен с уловиями..."
var agree = document.querySelector("#agreeCheck");
agree.onchange=function(event){
    regBttn.disabled = !agree.checked;
}

// regSubmit - "Зарегистрироваться"
var regBttn = document.querySelector("#regSubmit");
regBttn.onclick=function(event){
    // Проверить логин
    var login = document.querySelector("#regInputLogin");
    var loginHelp = document.querySelector("#regloginHelp");
    var wasPapaProud = false;
    wasPapaProud = isCorrectLogin(login.value, loginHelp);
    makePapaProud(login.parentNode, wasPapaProud);

    // Проверить имя
    var name = document.querySelector("#regInputName");
    var nameHelp = document.querySelector("#regnameHelp");
    var papasLast = isCorrectName(name.value, nameHelp);
    makePapaProud(name.parentNode, papasLast);    
    wasPapaProud = wasPapaProud && papasLast;

    // Проверить пароль
    var passwd = document.querySelector("#regInputPass");
    var passwdHelp = document.querySelector("#regpassHelp");
    papasLast = isCorrectPassword(passwd.value, passwdHelp);
    makePapaProud(passwd.parentNode, papasLast);
    wasPapaProud = wasPapaProud && papasLast;

    // Проверить что пароли совпадают
    var passwd2 = document.querySelector("#regInputPassRepeat");
    var passwd2Help = document.querySelector("#regpassHelpRepeat");
    papasLast = isSecondPswdTheSame(passwd.value, passwd2.value, passwd2Help);
    makePapaProud(passwd2.parentNode, papasLast);
    wasPapaProud = wasPapaProud && papasLast;

    // Проверить что нажат чекбокс    
    wasPapaProud = wasPapaProud && agree.checked;
    if(!wasPapaProud)
        return false;
}

/**
 * Проверить совпадают ли два пароля
 * @param {string} pswd1 - первый пароль
 * @param {string} pswd2 - второй пароль
 * @param {any} errorPlace - лейбл для отображения сообщения с результатом проверки
 */
function isSecondPswdTheSame(pswd1, pswd2, errorPlace){
    if(pswd1!=pswd2){
        errorPlace.innerHTML = "Пароли не совпадают";
        return false;
    }
    errorPlace.innerHTML = "Пароли совпадают";
    return true;
}

/**
 * Проверить корректность имени
 * @param {string} name - имя, введенное пользователем
 * @param {any} errorPlace - лейбл для отображения сообщения с результатом проверки
 */
function isCorrectName(name, errorPlace){
    var reg = new RegExp(`^([А-Яа-я]{2,20})|([A-Za-z]{2,20})$`, '');
    if (name==null){
        errorPlace.innerHTML = "Введите имя, пустое поле";
        return false;
    }
    if (name.length>20){
        errorPlace.innerHTML = "Имя не должно быть длиньше 20 символов";
        return false;
    }
    if (name.length<2){
        errorPlace.innerHTML = "Имя не должно быть короче 2 символов";
        return false;
    }    
    if(reg.test(name)){
        errorPlace.innerHTML = "Корректное имя";
        return true;
    }
    else {
        errorPlace.innerHTML = "Некорректное имя. Имя должно содержать от 2 до 20 символов английского или русского алфавита и/или цифр";
        return false;
    }
}

/**
 * Проверить корректность логина
 * @param {string} login - логин, введенный пользователем
 * @param {any} errorPlace - лейбл для отображения сообщения с результатом проверки
 */
function isCorrectLogin(login, errorPlace){
    var reg = new RegExp(`^[A-Za-z0-9]{2,20}$`, '');
    if (login==null){
        errorPlace.innerHTML = "Введите логин, пустое поле";
        return false;
    }
    if (login.length>20){
        errorPlace.innerHTML = "Логин не должен быть длиньше 20 символов";
        return false;
    }
    if (login.length<2){
        errorPlace.innerHTML = "Логин не должен быть короче 2 символов";
        return false;
    }    
    if(reg.test(login)){
        // TODO сделать проверку на сервере, не занят ли текущий логин
        errorPlace.innerHTML = "Корректный логин";
        return true;
    }
    else {
        errorPlace.innerHTML = "Некорректный логин. Логин должен содержать от 2 до 20 символов английского алфавита и/или цифр";
        return false;
    }    
}

/**
 * Проверить корректность пароля
 * @param {string} pswd - пароль, введенный пользователем
 * @param {any} errorPlace - лейбл для отображения сообщения с результатом проверки
 */
function isCorrectPassword(pswd, errorPlace){
    var reg = new RegExp(`^[A-Za-z0-9]{8,32}$`, '');
    if (pswd==null){
        errorPlace.innerHTML = "Введите пароль, пустое поле";
        return false;
    }
    if (pswd.length>32){
        errorPlace.innerHTML = "Пароль не должен быть длиньше 32 символов";
        return false;
    }
    if (pswd.length<8){
        errorPlace.innerHTML = "Пароль не должен быть короче 8 символов";
        return false;
    }    
    if(reg.test(pswd)){
        errorPlace.innerHTML = "Корректный пароль";
        return true;
    }
    else {
        errorPlace.innerHTML = "Некорректный пароль. Пароль должен содержать от 8 до 32 символов английского алфавита и/или цифр";
        return false;
    }  
}

/**
 * Добавить подсветку формы ввода данных в зависимости от корректности данных
 * @param {any} parentForm - форма ввода данных
 * @param {boolean} isProud - корректные ли данные
 */
function makePapaProud(parentForm, isProud){
    if(isProud){
        parentForm.classList.remove("has-error");
        parentForm.classList.add("has-success");
        return true;
    }
    else{
        parentForm.classList.remove("has-success");
        parentForm.classList.add("has-error");
        return false;
    }
}



