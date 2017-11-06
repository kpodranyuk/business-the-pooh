import * as poohApi from "./poohLkApi.js";

// По загрузке документа заполняем элементы, отображающие информацию о Пухе
$(document).ready(function(){
    $("#honeyAmount").text(translateHoney(poohApi.curUser.honeyAmount).toString()+" л меда");
    myHistoryPillBttn.click();

    window.onbeforeunload = function (e) {
        console.log("Выход из браузера");
        socket.emit('leave', { username: 'Администратор Пух' });
        localStorage.clear();
    };
});

function translateHoney(honey){
    console.log(honey.toString());
    var hon = honey.toString();
    if(hon == "0")
        return hon;
    return (parseFloat(hon.replace(",", "."))).toString();
}


// Создание сокетного соединения
var socket = io.connect();
var currentPill = "myHistoryPill";
// Изображение пчелы при выводе меда
var beeOut = document.querySelector("#outbee");

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
        wasPapaProud = isCorrectHoneyAmount(honeyCount.value, honeyCountHelp);
        makePapaProud(honeyCount.parentNode, wasPapaProud);
        if(wasPapaProud){
            // Отправить запрос на сервер
            poohApi.getHoney(honeyCount.value, function(result){
                if(result){
                    var thxForGet = document.querySelector("#thxForGet");
                    thxForGet.style.visibility = "visible";  
                    // Устанавливаем новый баланс Пуха
                    $("#honeyAmount").text(translateHoney(poohApi.curUser.honeyAmount).toString()+" л меда");
                    outBttn.disabled = true;
                }
            });
        }
    }
});

/* КНОПКИ МЕНЮ */
// myHistoryPill - История операций Пуха
var myHistoryPillBttn = document.querySelector("#myHistoryPill");
// usersHistoryPill - История операций пользователей
var historyPillBttn = document.querySelector("#usersHistoryPill");
// getHoneyPill - Вывод меда
var getPillBttn = document.querySelector("#getHoneyPill");

/* ДЕЙСТВИЯ ПО НАЖАТИЮ КНОПОК МЕНЮ */
// Вкладка Моя история
myHistoryPillBttn.onclick = function(event){
    currentPill = "myHistoryPill";
    console.log("Нажата кнопка Моя История в панели меню");
    // Получить данные с сервера
    poohApi.getOperations(function(result){
        // Вставить новые данные
        insertNewDataFotMyHistory(result);
    });
}

// Вкладка История
historyPillBttn.onclick = function(event){
    currentPill = "usersHistoryPill";
    console.log("Нажата кнопка История в панели меню");
    var thxForComissionWork = document.querySelector("#thxForComissionWork");
    thxForComissionWork.style.visibility = "hidden";  
    // Получить данные с сервера
    poohApi.lastOperationDay(function(result, success) {
        // Вставить новые данные
        insertNewDataFotUsersHistory(result, success);
    });
}

// Вкладка Вывод меда
getPillBttn.onclick = function(event){
    currentPill = "getHoneyPill";
    var thxForGet = document.querySelector("#thxForGet");
    thxForGet.style.visibility = "hidden";    
    // TODO получить от сервера количество товара для ввода и ограничить инпут
    poohApi.getHoneyInfo(function (result) {
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
                outBttn.disabled = true;
                return false;
            }
            else{
                inp.parentNode.classList.remove("has-error");
                inp.parentNode.classList.remove("has-success");
                inpHelp.innerHTML = "Не более "+(parseFloat((maxHoney.toString()).replace(",", "."))).toString() + " л";
                outBttn.disabled = false;
                $("#honeyInput").attr('min',0.005);
                $("#honeyInput").attr('max',maxHoney);
                $("#honeyInput").attr('step',0.010);
            }
        }
    });
}

// Кнопка вывода меда
var outBttn = document.querySelector("#honeyOut");
outBttn.onclick=outAnime.restart;

// Кнопка сбора и отправки комиссии
var comissionButton = document.querySelector("#getComission");
comissionButton.onclick = function(event){
    console.log("Нажата кнопка сбора комиссии");
    poohApi.getComission(function(balance, poohZP) {
        insertDataAfterGetComission(balance, poohZP);
    });
}

// Кнопка выхода из аккаунта
var logOutBttn = document.querySelector("#logOut");
logOutBttn.onclick = function(event){
    console.log("Нажата кнопка выхода из аккаунта");
    socket.emit('leave', { username: 'Администратор Пух' });
    localStorage.clear();
    window.location = "/";
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
 * @param {any} errorPlace - лейбл для отображения сообщения с результатом проверки
 */
function isCorrectHoneyAmount(honeyAmount, errorPlace){
    var reg = new RegExp(`^[0-5]([.,][0-9]{1,3})?$`, '');
    if (honeyAmount==null){
        errorPlace.innerHTML = "Введите количество меда, пустое поле";
        return false;
    } 
    if(reg.test(honeyAmount)){
        if (parseFloat(honeyAmount)<0.005 || parseFloat(honeyAmount)>5.0){
            errorPlace.innerHTML = "Количество меда не должно быть меньше 0.005 и больше 5.0";
            return false;
        }
        errorPlace.innerHTML = "Корректное количество меда";
        return true;
    }
    else {
        errorPlace.innerHTML = "Некорректное количество меда.<br>Количество меда должно быть положительным числом не больше 5";
        return false;
    }    
}


/**
 * Вставить новые данные о пользователях за прошлый оп. день.
 * @param {mass} data - массив объектов, содержащих информацию за прошлый операционный день
 * @param {bool} success - успешность запроса
 */
function insertNewDataFotUsersHistory(data, success) {
    console.log(data);
    console.log(success);
    // Очистить таблицу
    comissionButton.disabled = !success;
    if (success) {
        var tableBody = $("#usersHistoryBuyingLastDay");
        tableBody.empty();
        $("#poohZP").empty();
        if (data.length == 0) {
            comissionButton.disabled = true;
        }
        for (var i = 0; i < data.length; i++) {
            var row = "<tr>";
            row += "<td>"+new Date(data[i].date).toLocaleString()+"</td>";
            row += "<td>"+data[i].loginUser+"</td>";
            row += "<td>"+data[i].comission+"</td>";
            row += "</tr>"
            tableBody.append(row);
        }
    }
}


/**
 * Вставить новые данные после снятия комиссии
 * @param {number} balance - текущий баланс Пуха
 * @param {number} poohZP - зп Пуха на сегодняшний день
 */
function insertDataAfterGetComission(balance, poohZP) {
    var thxForComissionWork = document.querySelector("#thxForComissionWork");
    thxForComissionWork.style.visibility = "visible"; 

    comissionButton.disabled = true;
    // Очистить таблицу
    var tableBody = $("#usersHistoryBuyingLastDay");
    tableBody.empty();
   // Вставить информацию сколько Пух за сегодня заработал и его новый баланс
   $("#honeyAmount").text(translateHoney(poohApi.curUser.honeyAmount)+" л меда");
   $("#poohZP").text(poohZP);
}


/**
 * Вставить новые данные о совершенных операциях
 * @param {mass} data - массив объектов, содержащих информацию о операциях
 */
function insertNewDataFotMyHistory(data) {
    // Очистить таблицу
    var tableBody = $("#myHistoryOperations");
    tableBody.empty();
    for (var i = 0; i < data.length; i++) {
        var row = "<tr>";
        row += "<td>"+new Date(data[i].datatime).toLocaleString()+"</td>";
        row += "<td>"+getWordForTypeOperation(data[i].type)+"</td>";
        row += "<td>"+data[i].honeyCount+"</td>";
        row += "</tr>"
        tableBody.append(row);
    }
}

function getWordForTypeOperation(type) {
    if (type == 'E') {
        return "Начисление";
    } else if (type == 'G') {
        return "Вывод";
    }
}


/*   СОБЫТИЯ    */
socket.emit('join', {username: 'Администратор Пух'});

// Настал новый операционный день
socket.on('new-oper-day', function(data) {
    console.log("Сработало событие нового операционного дня");
    updatePillAfterEvent();
});



function updatePillAfterEvent() {
    if (currentPill == "usersHistoryPill") {
        // Обновляем информацию во вкладке исторя за прошлый день
        historyPillBttn.click();
    } else if(currentPill == "getHoneyPill") {
        // Обновляем информацию во вкладке вывода меда
        getPillBttn.click();
    }
}