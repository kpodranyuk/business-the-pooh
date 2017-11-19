import * as indexApi from "./indexApi.js";
import * as formCtrl from "./formControl.js";

// enterSubmit - "Войти в систему"
var enterBttn = document.querySelector("#enterSubmit");
enterBttn.onclick=function(event){
    // Проверить логин
    // enterInputLogin - инпут логина при входе
    var login = document.querySelector("#enterInputLogin");
    // enterloginHelp - подпись под инпутом логина при входе
    var loginHelp = document.querySelector("#enterloginHelp");
    var wasPapaProud = false;
    wasPapaProud = formCtrl.isCorrectLogin(login.value, loginHelp);
    formCtrl.makePapaProud(login.parentNode, wasPapaProud);

    // Проверить пароль
    // enterInputPass - инпут пароля при входе
    var passwd = document.querySelector("#enterInputPass");
    // enterpassHelp - подпись под инпутом пароля при входе
    var passwdHelp = document.querySelector("#enterpassHelp");
    wasPapaProud = wasPapaProud && formCtrl.makePapaProud(passwd.parentNode, formCtrl.isCorrectPassword(passwd.value, passwdHelp));
    if(!wasPapaProud) {
        return false;
    } else {
        indexApi.logIn();
        return false;
    }
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
    wasPapaProud = formCtrl.isCorrectLogin(login.value, loginHelp);
    formCtrl.makePapaProud(login.parentNode, wasPapaProud);

    // Проверить имя
    var name = document.querySelector("#regInputName");
    var nameHelp = document.querySelector("#regnameHelp");
    var papasLast = formCtrl.isCorrectName(name.value, nameHelp);
    formCtrl.makePapaProud(name.parentNode, papasLast);    
    wasPapaProud = wasPapaProud && papasLast;

    // Проверить пароль
    var passwd = document.querySelector("#regInputPass");
    var passwdHelp = document.querySelector("#regpassHelp");
    papasLast = formCtrl.isCorrectPassword(passwd.value, passwdHelp);
    formCtrl.makePapaProud(passwd.parentNode, papasLast);
    wasPapaProud = wasPapaProud && papasLast;

    // Проверить что пароли совпадают
    var passwd2 = document.querySelector("#regInputPassRepeat");
    var passwd2Help = document.querySelector("#regpassHelpRepeat");
    papasLast = formCtrl.isSecondPswdTheSame(passwd.value, passwd2.value, passwd2Help);
    formCtrl.makePapaProud(passwd2.parentNode, papasLast);
    wasPapaProud = wasPapaProud && papasLast;

    // Проверить что нажат чекбокс    
    wasPapaProud = wasPapaProud && agree.checked;
    if(!wasPapaProud) {
        return false;
    } else {
        indexApi.sendRegist();
        return false;
    }
    return false;
}