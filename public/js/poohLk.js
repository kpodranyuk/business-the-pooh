import * as poohApi from "./poohLkApi.js";

// Создание сокетного соединения
var socket = io.connect();
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
    console.log("Нажата кнопка Моя История в панели меню");
    // TODO обновить информацию с сервера
}

// Вкладка История
historyPillBttn.onclick = function(event){
    console.log("Нажата кнопка История в панели меню");
    // Получить данные с сервера
    poohApi.lastOperationDay(function(result) {
        // Вставить новые данные
        insertNewDataFotUsersHistory(result);
    });
}

// Вкладка Вывод меда
getPillBttn.onclick = function(event){
    // Стираем информацию с инпута
    var honeyCount = document.querySelector("#honeyInput");
    honeyCount.value = "";
    var honeyCountHelp = document.querySelector("#honeyInputHelp");
    // Задаем строке-помощнику текст по умолчанию
    honeyCountHelp.innerHTML = "Не более 5 литров в день";
    // Удаляем классы корректности с родительской формы
    honeyCount.parentNode.classList.remove("has-error");
    honeyCount.parentNode.classList.remove("has-success");
}

// Кнопка вывода меда
var outBttn = document.querySelector("#honeyOut");
outBttn.onclick=outAnime.restart;

// Кнопка сбора и отправки комиссии
var comissionButton = document.querySelector("#getComission");
comissionButton.onclick = function(event){
    console.log("Нажата кнопка сбора комиссии");
}

// Кнопка выхода из аккаунта
var logOutBttn = document.querySelector("#logOut");
logOutBttn.onclick = function(event){
    console.log("Нажата кнопка выхода из аккаунта");
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
 * Вставить новые данные о пеользователях за прошлый оп. день.
 * {mass} data - массив объектов, содержащих информацию за прошлый операционный день
 */
function insertNewDataFotUsersHistory(data) {
    // Очистить таблицу
    var tableBody = $("#usersHistoryBuyingLastDay");
    tableBody.empty();
    for (var i = 0; i < data.length; i++) {
        var row = "<tr>";
        row += "<td>"+new Date(data[i].date).toLocaleString()+"</td>";
        row += "<td>"+data[i].loginUser+"</td>";
        row += "<td>"+data[i].comission+"</td>";
        row += "</tr>"
        tableBody.append(row);
    }
}


/*   СОБЫТИЯ    */
socket.emit('join', {username: 'Администратор Пух'});

// Настал новый операционный день
socket.on('new-oper-day', function(data) {

});