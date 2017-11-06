import * as userApi from "./userLkApi.js";

// Создание сокетного соединения
var socket = io.connect();
var currentPill = "enterPill";

// По загрузке документа заполняем элементы, отображающие информацию о пользователе
$(document).ready(function(){
    // TODO сделать функцию для работы с localStorage
    // Устанавливаем информацию о пользователе
    // userImage loginDropdown userTypeName productLabel honeyLabel
    // Устанавливаем изображение
    $("#userImage").attr("src",getUserImagePath(userApi.curUser.productType));
    // Устанавливаем логин
    $("#loginDropdown").text(userApi.curUser.login);
    // Устанавливаем тип пользователя и имя
    $("#userTypeName").text(translateTypeToString(userApi.curUser.productType)+" "+userApi.curUser.name);
    setUserBalance();

    enterPillBttn.click();
});

function translateHoney(honey){
    console.log(honey.toString());
    var hon = honey.toString();
    if(hon == "0")
        return hon;
    return (parseFloat(hon.replace(",", "."))).toString();
}

function setUserBalance(){
    // Устанавливаем количество товара пользователя
    $("#productLabel").text(translateProductCountToRussian(userApi.curUser.productAmount, userApi.curUser.productType));
    // Устанавливаем количество меда пользователя
    $("#honeyLabel").text(translateHoney(userApi.curUser.honeyAmount).toString()+" л меда");
}

// Изображение пчелы при выводе меда
var beeOut = document.querySelector("#outbee");

// Изображение пчелы при вводе товара
var beeIn = document.querySelector("#inbee");

// Анимация пчелы при выводе меда
var outAnime = anime({
    targets: beeOut,
    rotate: '1turn',
    autoplay: false,
    duration: 800,
    begin: function(anim) {
        // СОБЫТИЕ ЗАВЕРШЕНИЯ АНИМАЦИИ ПРИ ВЫВОДЕ МЕДА
        // Проверить введенное количество меда
        var honeyCount = document.querySelector("#honeyInput");
        var honeyCountHelp = document.querySelector("#honeyInputHelp");
        var wasPapaProud = false;
        wasPapaProud = isCorrectHoneyAmount(honeyCount.value, $("#honeyInput").attr('min'), $("#honeyInput").attr('max'), honeyCountHelp);
        makePapaProud(honeyCount.parentNode, wasPapaProud);
        if(wasPapaProud){
            // Отправить запрос на сервер
            userApi.getHoney(honeyCount.value, function(result){
                if(result){
                    var thxForEnter = document.querySelector("#thxForGet");
                    thxForEnter.style.visibility = "visible";  
                    // Устанавливаем количество товара пользователя
                    setUserBalance();
                    honeyOutBttn.disabled = true;
                }
            });
        }
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
        // Проверить введенное количество меда
        var productCount = document.querySelector("#goodsInput");
        var productCountHelp = document.querySelector("#goodsInputHelp");
        var wasPapaProud = false;
        wasPapaProud = isCorrectProductAmount(productCount.value, $("#goodsInput").attr('min'), $("#goodsInput").attr('max'), productCountHelp);
        makePapaProud(productCount.parentNode, wasPapaProud);
        if(wasPapaProud){
            // Отправить запрос на сервер
            userApi.enterProduct(productCount.value, function(result){
                if(result){
                    var thxForEnter = document.querySelector("#thxForEnter");
                    thxForEnter.style.visibility = "visible";  
                    // Устанавливаем количество товара пользователя
                    setUserBalance();
                    honeyInBttn.disabled = true;
                }
            });
        }
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
// accPill - Аккаунт
var accPillBttn = document.querySelector("#accPill");
// helpPill - О сервисе
var helpPillBttn = document.querySelector("#helpPill");

/* ДЕЙСТВИЯ ПО НАЖАТИЮ КНОПОК МЕНЮ */
// Вкладка Купить
buyPillBttn.onclick = function(event){
    currentPill = "buyPill";
    // TODO получить от сервера количество горшочков для покупки и добавить в селект
    userApi.buyHoneyInfo(function (result) {
        var maxPots = 0;
        console.log(result);
        if(result != null) {
            maxPots = result;
            var sel = document.querySelector("#selectPots");
            var selHelp = document.querySelector("#selectPotsHelp");
            if(maxPots<1){
                sel.value = "";
                makePapaProud(sel.parentNode, false);
                selHelp.innerHTML = "Недостаточно средств для покупки";
                potsInBuyBttn.disabled = true;
                return false;
            }
            else{
                sel.parentNode.classList.remove("has-error");
                sel.parentNode.classList.remove("has-success");
                selHelp.innerHTML = "Не более "+ maxPots;
                potsInBuyBttn.disabled = false;
                $("#selectPots").attr('min',1);
                $("#selectPots").attr('max',maxPots);
            }
        }
    });    
    // Прячем div'ы
    var div2 = document.querySelector("#secondStep");
    div2.style.visibility = "hidden";
    var div3 = document.querySelector("#thirdStep");
    div3.style.visibility = "hidden";    
    var bttnsDiv = document.querySelector("#buyButtons");
    bttnsDiv.style.visibility = "hidden";
}

// Вкладка История
historyPillBttn.onclick = function(event){
    currentPill = "historyPill";
    console.log("Нажата кнопка История в панели меню");
    function getWordForTypeOperation(type) {
        if (type == 'E') {
            return "Ввод";
        } else if (type == 'G') {
            return "Вывод";
        } else if (type == 'B') {
            return "Покупка";
        }
    }
    // TODO обновить информацию с сервера
    userApi.getOperations(function(operations) {
        var tableBody = $("#operationsHistory");
        tableBody.empty();
        for (var i = 0; i < operations.length; i++) {
            var row = "<tr>";
            var productAmount = "--", 
                honeyPots = "-", 
                honeyCount = "-", 
                comission = "--";
            var datatime = new Date(operations[i].datatime).toLocaleString();
            var type = getWordForTypeOperation(operations[i].type);
            if (type == "Покупка") {
                productAmount = operations[i].productAmount + " шт";
                honeyPots = operations[i].honeyPots + " шт";
                honeyCount = "/" + operations[i].honeyCount + " л";
                comission = operations[i].comission + " л";
            } else if (type == "Ввод") {
                productAmount = operations[i].productAmount + " шт";
            } else if (type == "Вывод") {
                honeyCount = operations[i].honeyCount + " л";
                honeyPots = "";
            }

            row += "<td>"+datatime+"</td>"+"<td>"+type+"</td>"+"<td>"+productAmount+"</td>";
            row += "<td>"+honeyPots+honeyCount+"</td>" + "<td>"+comission+"</td>"
            row += "</tr>";
            tableBody.append(row);
        }
    });
}

// Вкладка Ввод товара
enterPillBttn.onclick = function(event){
    currentPill = "enterPill";
    var thxForEnter = document.querySelector("#thxForEnter");
    thxForEnter.style.visibility = "hidden";    
    // TODO получить от сервера количество товара для ввода и ограничить инпут
    userApi.enterProductInfo(function (result) {
        var maxProduct = 0;
        console.log(result);
        if(result != null) {
            maxProduct = result;
            var inp = document.querySelector("#goodsInput");
            inp.value = "";
            var inpHelp = document.querySelector("#goodsInputHelp");
            if(maxProduct<1){
                inp.value = "";
                makePapaProud(inp.parentNode, false);
                inpHelp.innerHTML = "Вы исчерпали ежедневный лимит ввода товара в виде 50 штук";
                honeyInBttn.disabled = true;
                return false;
            }
            else{
                inp.parentNode.classList.remove("has-error");
                inp.parentNode.classList.remove("has-success");
                inpHelp.innerHTML = "Не более "+ maxProduct + " шт";
                honeyInBttn.disabled = false;
                $("#goodsInput").attr('min',1);
                $("#goodsInput").attr('max',maxProduct);
            }
        }
    });      
}

// Вкладка Вывод меда
getPillBttn.onclick = function(event){
    currentPill = "getPill";
    var thxForGet = document.querySelector("#thxForGet");
    thxForGet.style.visibility = "hidden";    
    // TODO получить от сервера количество товара для ввода и ограничить инпут
    userApi.getHoneyInfo(function (result) {
        var maxHoney = 0;
        console.log(result);
        if(result != null) {
            maxHoney = result;
            var inp = document.querySelector("#honeyInput");
            inp.value = "";
            var inpHelp = document.querySelector("#honeyInputHelp");
            if(maxHoney<0.005){
                inp.value = "";
                makePapaProud(inp.parentNode, false);
                inpHelp.innerHTML = "Невозможно осуществить снятие<br>На Вашем счету недостаточно меда или Вы исчерпали ежедневный лимит вывода меда в виде 5 литров";
                honeyOutBttn.disabled = true;
                return false;
            }
            else{
                inp.parentNode.classList.remove("has-error");
                inp.parentNode.classList.remove("has-success");
                inpHelp.innerHTML = "Не более "+(parseFloat((maxHoney.toString()).replace(",", "."))).toString() + " л";
                honeyOutBttn.disabled = false;
                $("#honeyInput").attr('min',0.005);
                $("#honeyInput").attr('max',maxHoney);
                $("#honeyInput").attr('step',0.010);
            }
        }
    });
}

// Вкладка Настройки аккаунта (вход)
settingsPillBttn.onclick = function(event){
    currentPill = "settingsPill";
    // Стираем информацию с инпута и строки-помощника
    var pswdInput = document.querySelector("#passwordInput");
    pswdInput.value = "";
    var pswdInputHelp = document.querySelector("#passwordInputHelp");
    pswdInputHelp.innerHTML = "";
    // Удаляем классы корректности с родительской формы
    pswdInput.parentNode.classList.remove("has-error");
    pswdInput.parentNode.classList.remove("has-success");
}

// Вкладка Аккаунт
accPillBttn.onclick = function(event) {
    currentPill = "accPill";
}
// Вкладка О сервисе
helpPillBttn.onclick = function(event) {
    currentPill = "helpPill";
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
// openForgetMe - Кнопка, открывающая модальное окно подтверждения пароля при деактивации аккаунта
var openForgetMeBttn = document.querySelector("#openForgetMe");
// forgetMeSubmit - Деактивировать аккаунт
var forgetMeBttn = document.querySelector("#forgetMeSubmit");

/* ДЕЙСТВИЯ ПО НАЖАТИЮ КНОПОК */
// Выбрано количество горшочков для покупки
potsInBuyBttn.onclick = function(event){
    var papa = isCorrectPotsCount(Number($("#selectPots").val()), 
    $("#selectPots").attr('min'), 
    $("#selectPots").attr('max'), 
    document.querySelector("#selectPotsHelp"));
    if (papa){
        // Добавляем информацию о покупке на виджеты
        $("#potsCountToBuy").text($("#selectPots").val() + " шт.");
        // TODO узнать текущий курс
        $("#productCountToBuy").text(Number($("#selectPots").val())*getCourse(userApi.curUser.productType) + " шт.");
        $("#comissionSizeForBuy").text(Number($("#selectPots").val())*0.25*(Number(userApi.curUser.promotion.percent)/100));
        var div = document.querySelector("#secondStep");
        div.style.visibility = "visible";
        var bttnsDiv = document.querySelector("#buyButtons");
        bttnsDiv.style.visibility = "visible";
    }
}

function isCorrectPotsCount(count, min, max, errorPlace){
    if(count >= min && count <= max){
        errorPlace.innerHTML = "Горшочки выбраны";
        return true;
    }
    errorPlace.innerHTML = "Количество горшочков не должно быть меньше " + min.toString()
    + " и больше " + max.toString();            
    return false;
}

// Подтверждение операции покупки
makeBuyBttn.onclick = function(event){
    userApi.buyHoney($("#selectPots").val(), function(result){
        if(result == true){
            setUserBalance();
            $("#comissionSize").text($("#comissionSizeForBuy").text());
            potsInBuyBttn.disabled = true;
            var div = document.querySelector("#thirdStep");
            div.style.visibility = "visible";
            var bttnsDiv = document.querySelector("#buyButtons");
            bttnsDiv.style.visibility = "hidden";
        }
    });
}

// Отмена операции покупки
stopBuyBttn.onclick = function(event){
    var div = document.querySelector("#secondStep");
    div.style.visibility = "hidden";
    var bttnsDiv = document.querySelector("#buyButtons");
    bttnsDiv.style.visibility = "hidden";
}

// Кнопка вывода меда
honeyOutBttn.onclick = outAnime.restart;

// Кнопка ввода товара
honeyInBttn.onclick = inAnime.restart;

// Переключение на скрытую вкладку с настройками аккаунта
showAccSettingsBttn.onclick = function(event){
    // Осуществляем проверку пароля на корректность
    var pswdInput = document.querySelector("#passwordInput");
    var pswdInputHelp = document.querySelector("#passwordInputHelp");
    var wasPapaProud = false;
    wasPapaProud = isCorrectPassword(pswdInput.value, pswdInputHelp);
    makePapaProud(pswdInput.parentNode, wasPapaProud);
    // Если пароль корректный, открываем настройки
    if(wasPapaProud){
        // TODO сделать проверку корректности пароля
        if(pswdInput.value!=userApi.curUser.password){
            makePapaProud(pswdInput.parentNode, false);
            pswdInputHelp.innerHTML = "Неправильный пароль";
        }
        else{
            $('#pills a[href="#trueAcc"]').tab('show');
        }
    }
}

// Открытие форм обновления пароля
openNewPswdBttn.onclick = function(event){
    // Очищаем виджеты
    clearMakeNewPswdInputs();
    var div = document.querySelector("#pswdDiv");
    div.style.visibility = "visible";
}

// Сохранить новый пароль
saveNewPswdBttn.onclick = function(event){
    // Проверяем корректность паролей
    // Сначала текущий
    var curpswdInput = document.querySelector("#oldPswdInput");
    var curpswdInputHelp = document.querySelector("#oldPswdInputHelp");
    var wasPapaProud = false;
    wasPapaProud = isCorrectPassword(curpswdInput.value, curpswdInputHelp);
    makePapaProud(curpswdInput.parentNode, wasPapaProud);

    // Затем новый
    var newpswdInput = document.querySelector("#newPswdInput");
    var newpswdInputHelp = document.querySelector("#newPswdInputHelp");
    var papasLast = isCorrectPassword(newpswdInput.value, newpswdInputHelp);
    makePapaProud(newpswdInput.parentNode, papasLast);    
    wasPapaProud = wasPapaProud && papasLast;

    // Затем повтор нового
    var newRepeatPswdInput = document.querySelector("#newPswdInputRepeat");
    var newRepeatPswdInputHelp = document.querySelector("#newPswdInputRepeatHelp");
    papasLast = isCorrectPassword(newRepeatPswdInput.value, newRepeatPswdInputHelp);
    if(papasLast)
        papasLast = isSecondPswdTheSame(newpswdInput.value, newRepeatPswdInput.value, newRepeatPswdInputHelp);
    makePapaProud(newRepeatPswdInput.parentNode, papasLast);    
    wasPapaProud = wasPapaProud && papasLast;

    // TODO сделать обновление пароля
    if(!wasPapaProud)
        return false;
    else{
        if(curpswdInput.value!=userApi.curUser.password){
            makePapaProud(curpswdInput.parentNode, false);
            curpswdInputHelp.innerHTML = "Неправильный пароль";
        }
        else{
            ;
            /* ЗАКОММЕНТИРОВАНО ДО НАЧАЛА ПОДДЕРЖКИ НА СЕРВЕРЕ
            userApi.updatePassword(newpswdInput.value, function (result) {
                if(result == true) {
                    var div = document.querySelector("#pswdDiv");    
                    div.style.visibility = "hidden";
                }
            }*/
        }
        
    }
    var div = document.querySelector("#pswdDiv");    
    div.style.visibility = "hidden";
}

// Выйти из аккаунта
logOutBttn.onclick = function(event){
    console.log("Нажата кнопка выхода из аккаунта");
    socket.emit('leave', { username: userApi.curUser.login });
    localStorage.clear();
    window.location = "/";
}

openForgetMeBttn.onclick = function(event){
    // Очищаем поля для ввода пароля
    var pswdInput = document.querySelector("#enterPswd");
    pswdInput.value = "";
    var pswdInputHelp = document.querySelector("#enterPswdHelp");
    pswdInputHelp.innerHTML = "";
    pswdInput.parentNode.classList.remove("has-error");
    pswdInput.parentNode.classList.remove("has-success");
}

// Деактивировать аккаунт
forgetMeBttn.onclick = function(event){
    // Осуществляем проверку пароля на корректность
    var pswdInput = document.querySelector("#enterPswd");
    var pswdInputHelp = document.querySelector("#enterPswdHelp");
    var wasPapaProud = false;
    wasPapaProud = isCorrectPassword(pswdInput.value, pswdInputHelp);
    makePapaProud(pswdInput.parentNode, wasPapaProud);
    // Если пароль корректный, TODO деактивировать пользователя
    if(!wasPapaProud){
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

/**
 * Проверить корректность количества меда для вывода
 * @param {string} honeyAmount - значение, введенное пользователем
 * @param {number} min - минимально возможное значение
 * @param {number} max - максимально возможное значение
 * @param {any} errorPlace - лейбл для отображения сообщения с результатом проверки
 */
function isCorrectHoneyAmount(honeyAmount, min, max, errorPlace){
    var reg = new RegExp(`^[0-5]([.,][0-9]{1,3})?$`, '');
    if (honeyAmount==null){
        errorPlace.innerHTML = "Введите количество меда, пустое поле";
        return false;
    } 
    if(reg.test(honeyAmount)){
        if (parseFloat(honeyAmount)<min || parseFloat(honeyAmount)>max){
            errorPlace.innerHTML = "Количество меда не должно быть меньше " + min.toString()
            + " и больше " + max.toString();            
            return false;
        }
        errorPlace.innerHTML = "Корректное количество меда";
        return true;
    }
    else {
        errorPlace.innerHTML = "Некорректное количество меда.<br>Количество меда должно быть положительным числом меньше 5";
        return false;
    }    
}

/**
 * Проверить корректность количества товара для ввода
 * @param {string} productAmount - значение, введенное пользователем
 * @param {number} min - минимально возможное значение
 * @param {number} max - максимально возможное значение
 * @param {any} errorPlace - лейбл для отображения сообщения с результатом проверки
 */
function isCorrectProductAmount(productAmount, min, max, errorPlace){
    console.log(productAmount);
    var reg = new RegExp(`^([1-9]{1}|([1-5]{1}[0-9]{1}))$`, '');
    if (productAmount==null){
        errorPlace.innerHTML = "Введите количество товара, пустое поле";
        return false;
    } 
    if(reg.test(productAmount)){
        if (parseInt(productAmount)<min || parseInt(productAmount)>max){
            errorPlace.innerHTML = "Количество товара не должно быть меньше " + min.toString()
            + " и больше " + max.toString();
            return false;
        }
        errorPlace.innerHTML = "Корректное количество товара";
        return true;
    }
    else {
        errorPlace.innerHTML = "Некорректное количество товара.<br>Количество товара должно быть положительным целым числом не больше 50";
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
 * Очистить виджеты обновления пароля в личном кабинете
 */
function clearMakeNewPswdInputs(){
    // Очищаем инпуты, строки-помощники и классы для форм ввода паролей
    // Сначала текущий
    var curpswdInput = document.querySelector("#oldPswdInput");
    curpswdInput.value = "";
    var curpswdInputHelp = document.querySelector("#oldPswdInputHelp");
    curpswdInputHelp.innerHTML = "";
    curpswdInput.parentNode.classList.remove("has-error");
    curpswdInput.parentNode.classList.remove("has-success");

    // Затем новый
    var newpswdInput = document.querySelector("#newPswdInput");
    newpswdInput.value = "";
    var newpswdInputHelp = document.querySelector("#newPswdInputHelp");
    newpswdInputHelp.innerHTML = "";
    newpswdInput.parentNode.classList.remove("has-error");
    newpswdInput.parentNode.classList.remove("has-success");

    // Затем повтор нового
    var newRepeatPswdInput = document.querySelector("#newPswdInputRepeat");
    newRepeatPswdInput.value = "";
    var newRepeatPswdInputHelp = document.querySelector("#newPswdInputRepeatHelp");
    newRepeatPswdInputHelp.innerHTML = "";
    newRepeatPswdInput.parentNode.classList.remove("has-error");
    newRepeatPswdInput.parentNode.classList.remove("has-success");
}

/**
 * Конвертировать количество товара у пользователя в строку
 * @param {int} count - количество товара пользователя
 * @param {string} userType - тип пользователя
 */
function translateProductCountToRussian(count, userType){
    var countStr = count + '';
    var strlen = countStr.length;
    // 1 _
    // Если последняя цифра 1 и это не 11..
    if(countStr.charAt(countStr.length-1)==1 && countStr.endsWith("11")==false){
        if (userType == "B")
            return countStr+" шарик";
        if (userType == "P")
            return countStr+" горшочек";
        if (userType == "F")
            return countStr+" цветок";
    }
    // 2-4 а/чка/тка
    // Если последняя цифра 2-4 и это не 11-14..
    else if(countStr.charAt(countStr.length-1)==2 && countStr.endsWith("12")==false 
        || countStr.charAt(countStr.length-1)==3 && countStr.endsWith("13")==false
        || countStr.charAt(countStr.length-1)==4 && countStr.endsWith("14")==false){
        if (userType == "B")
            return countStr+" шарика";
        if (userType == "P")
            return countStr+" горшочка";
        if (userType == "F")
            return countStr+" цветка";
    }
    // 5-20 ов/чков/тков
    // Если последняя цифра 5-0...
    else{
        if (userType == "B")
            return countStr+" шариков";
        if (userType == "P")
            return countStr+" горшочков";
        if (userType == "F")
            return countStr+" цветков";
    }
}

/**
 * Конвертировать типа пользователя в строку
 * @param {string} userType - тип пользователя
 */
function translateTypeToString(userType){
    if (userType == "B")
        return "Пятачок";
    if (userType == "P")
        return "Совунья";
    if (userType == "F")
        return "Кролик";
    if (userType == "H")
        return "Винни Пух";
}

/**
 * Получить путь к изображению пользователя
 * @param {string} userType - тип пользователя
 */
function getUserImagePath(userType){
    if (userType == "B")
        return "images/users/pig.png";
    if (userType == "P")
        return "images/users/owl.png";
    if (userType == "F")
        return "images/users/rabbit.png";
    if (userType == "H")
        return "images/pooh.png";
}

/**
 * Получить стоимость одного товара пользователя в зависимости от его типа
 * @param {string} userType - тип пользователя
 */
function getCourse(userType){
    if (userType == "B")
        return 10;
    if (userType == "P")
        return 5;
    if (userType == "F")
        return 10;
}


/*   СОБЫТИЯ    */
socket.emit('join', {username: userApi.curUser.login});

// Настал новый операционный день
socket.on('new-oper-day', function(data) {
    console.log("Сработало событие нового операционного дня");
    // В зависимости от вкладки будем выбирать что обновлять
    updatePillAfterEvent();
});

// У пчел кто то купил мед
socket.on('buy-honey', function(data) {
    console.log("Сработало событие покупки меда у пчел");
    if (currentPill == "buyPill" && userApi.curUser.login != data.username) {
        // Обновляем информацию во вкладке покупки меда
        buyPillBttn.click();
    }
});

// Пух снял комиссию с пользователей
socket.on('get-comission', function(data) {
    console.log("Сработало событие снятия комиссии с пользователей");
    // Подгружаем обновленный баланс с сервера
    userApi.getUserBalance(function() {
        setUserBalance();
        updatePillAfterEvent();
    });

});

function updatePillAfterEvent() {
    if (currentPill == "buyPill") {
        // Обновляем информацию во вкладке покупки меда
        buyPillBttn.click();
    } else if (currentPill == "enterPill") {
        // Обновляем информацию во вкладке ввода товара
        enterPillBttn.click();
    } else if(currentPill == "getPill") {
        // Обновляем информацию во вкладке вывода меда
        getPillBttn.click();
    }
}