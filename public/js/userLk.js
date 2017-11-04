import * as userApi from "./userLkApi.js";
//userApi.sayHiUser();

// Изображение пчелы при выводе меда
var beeOut = document.querySelector("#outbee");
console.log(beeOut);

// Изображение пчелы при вводе товара
var beeIn = document.querySelector("#inbee");
console.log(beeIn);

// Анимация пчелы при выводе меда
var outAnime = anime({
    targets: beeOut,
    rotate: '1turn',
    autoplay: false,
    duration: 800,
    begin: function(anim) {
        // СОБЫТИЕ ЗАВЕРШЕНИЯ АНИМАЦИИ ПРИ ВЫВОДЕ МЕДА
        console.log("Нажата кнопка вывода меда");
        // Проверить введенное количество меда
        var honeyCount = document.querySelector("#honeyInput");
        console.log(honeyCount);
        var honeyCountHelp = document.querySelector("#honeyInputHelp");
        console.log(honeyCountHelp);
        var wasPapaProud = false;
        wasPapaProud = isCorrectHoneyAmount(honeyCount.value, honeyCountHelp);
        makePapaProud(honeyCount.parentNode, wasPapaProud);
      }
});

// Анимация пчелы при вводе товара
var inAnime = anime({
    targets: beeIn,
    rotate: '1turn',
    autoplay: false,
    direction: 'reverse',
    duration: 1200,
    begin: function(anim) {
        // СОБЫТИЕ ЗАВЕРШЕНИЯ АНИМАЦИИ ПРИ ВВОДЕ ТОВАРА
        console.log("Нажата кнопка ввода товара");
        // Проверить введенное количество меда
        var productCount = document.querySelector("#goodsInput");
        console.log(productCount);
        var productCountHelp = document.querySelector("#goodsInputHelp");
        console.log(productCountHelp);
        var wasPapaProud = false;
        wasPapaProud = isCorrectProductAmount(productCount.value, productCountHelp);
        makePapaProud(productCount.parentNode, wasPapaProud);
      }
});
/* КНОПКИ МЕНЮ */
// buyPill - Купить
var buyPillBttn = document.querySelector("#buyPill");
// historyPill - История операций
var historyPillBttn = document.querySelector("#historyPill");
// enterPill - Ввод товара
var enterPillBttn = document.querySelector("#enterPill");
// getPill - Вывод меда
var getPillBttn = document.querySelector("#getPill");
// settingsPill - Настройки аккаунта (ввод пароля)
var settingsPillBttn = document.querySelector("#settingsPill");

/* ДЕЙСТВИЯ ПО НАЖАТИЮ КНОПОК МЕНЮ */
// Вкладка Купить
buyPillBttn.onclick = function(event){
    console.log("Нажата кнопка Купить в панели меню");
    // TODO спрятать divы и задать количеству горшочков значение по умолчанию
}

// Вкладка История
historyPillBttn.onclick = function(event){
    console.log("Нажата кнопка История в панели меню");
    // TODO обновить информацию с сервера
}

// Вкладка Ввод товара
enterPillBttn.onclick = function(event){
    console.log("Нажата кнопка Ввод товара в панели меню");
    // TODO стереть информацию с инпута
}

// Вкладка Вывод меда
getPillBttn.onclick = function(event){
    console.log("Нажата кнопка Вывод меда в панели меню");
    // TODO стереть информацию с инпута
}

// Вкладка Настройки аккаунта (вход)
settingsPillBttn.onclick = function(event){
    console.log("Нажата кнопка Настройка аккаунта в панели меню");
    // TODO стереть информацию с инпута
}


/* КНОПКИ УПРАВЛЕНИЯ */
// chosenPots - Выбрано количество горшочков для покупки
var potsInBuyBttn = document.querySelector("#chosenPots");
// argeeToBuy - Подтверждение операции покупки
var makeBuyBttn = document.querySelector("#argeeToBuy");
// cancelBuy - Отмена операции покупки
var stopBuyBttn = document.querySelector("#cancelBuy");
// honeyOut - Кнопка вывода меда
var honeyOutBttn = document.querySelector("#honeyOut");
// honeyIn - Кнопка ввода товара
var honeyInBttn = document.querySelector("#honeyIn");
// cont - Переключение на скрытую вкладку с настройками аккаунта
var showAccSettingsBttn = document.querySelector("#cont");
// makeNewPswd - Открытие форм обновления пароля
var openNewPswdBttn = document.querySelector("#makeNewPswd");
// saveNewPswd - Сохранить новый пароль
var saveNewPswdBttn = document.querySelector("#saveNewPswd");
// logOut - Выйти из аккаунта
var logOutBttn = document.querySelector("#logOut");
// forgetMeSubmit - Деактивировать аккаунт
var forgetMeBttn = document.querySelector("#forgetMeSubmit");

/* ДЕЙСТВИЯ ПО НАЖАТИЮ КНОПОК */
// Выбрано количество горшочков для покупки
potsInBuyBttn.onclick = function(event){
    console.log("Нажата кнопка подтверждения выбора количества горшочков для покупки");
    var div = document.querySelector("#secondStep");
    div.style.visibility = "visible";
}

// Подтверждение операции покупки
makeBuyBttn.onclick = function(event){
    console.log("Нажата кнопка подтверждения операции покупки");
    var div = document.querySelector("#thirdStep");
    div.style.visibility = "visible";
    var bttnsDiv = document.querySelector("#buyButtons");
    bttnsDiv.style.visibility = "hidden";
}

// Отмена операции покупки
stopBuyBttn.onclick = function(event){
    console.log("Нажата кнопка отмены операции покупки");
    var div = document.querySelector("#secondStep");
    div.style.visibility = "hidden";
}

// Кнопка вывода меда
honeyOutBttn.onclick = outAnime.restart;

// Кнопка ввода товара
honeyInBttn.onclick = inAnime.restart;

// Переключение на скрытую вкладку с настройками аккаунта
showAccSettingsBttn.onclick = function(event){
    console.log("Нажата кнопка подтверждения пароля для открытия настроек аккаунта");
    // TODO сделать проверку корректно введенного пароля
    $('#pills a[href="#trueAcc"]').tab('show');
}

// Открытие форм обновления пароля
openNewPswdBttn.onclick = function(event){
    console.log("Нажата кнопка отображения виджетов для обновления пароля");
}

// Сохранить новый пароль
saveNewPswdBttn.onclick = function(event){
    console.log("Нажата кнопка сохранения нового пароля");
}

// Выйти из аккаунта
logOutBttn.onclick = function(event){
    console.log("Нажата кнопка выхода из аккаунта");
}

// Деактивировать аккаунт
forgetMeBttn.onclick = function(event){
    console.log("Нажата кнопка подтверждения деактивации аккаунта");
}

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

function isCorrectHoneyAmount(honeyAmount, errorPlace){
    console.log("I'm in isCorrectHoneyAmount");
    var reg = new RegExp(`^[0-5]([.,][0-9]{1,3})?$`, '');
    if (honeyAmount==null){
        console.log("honeyAmount is null");
        errorPlace.innerHTML = "Введите количество меда, пустое поле";
        return false;
    } 
    if(reg.test(honeyAmount)){
        if (parseFloat(honeyAmount)<0.005 || parseFloat(honeyAmount)>5.0){
            console.log("wrong amount of honeyAmount");
            errorPlace.innerHTML = "Количество меда не должно быть меньше 0.005 и больше 5.0";
            return false;
        }
        console.log("true, correct honeyAmount");
        errorPlace.innerHTML = "Корректное количество меда";
        return true;
    }
    else {
        console.log("wrong, incorrect honeyAmount");
        errorPlace.innerHTML = "Некорректное количество меда.<br>Количество меда должно быть положительным числом меньше 5";
        return false;
    }    
}

function isCorrectProductAmount(productAmount, errorPlace){
    console.log("I'm in isCorrectProductAmount");
    var reg = new RegExp(`^[1-9]|([1-5][0-9])$`, '');
    if (productAmount==null){
        console.log("productAmount is null");
        errorPlace.innerHTML = "Введите количество товара, пустое поле";
        return false;
    } 
    if(reg.test(productAmount)){
        if (parseInt(productAmount)<1 || parseInt(productAmount)>50){
            console.log("wrong amount of productAmount");
            errorPlace.innerHTML = "Количество товара не должно быть меньше 1 и больше 50";
            return false;
        }
        console.log("true, correct productAmount");
        errorPlace.innerHTML = "Корректное количество товара";
        return true;
    }
    else {
        console.log("wrong, incorrect productAmount");
        errorPlace.innerHTML = "Некорректное количество товара.<br>Количество товара должно быть положительным целым числом не больше 50";
        return false;
    }    
}