import {makePapaProud, forgetPapasPride} from "./formControl.js";

// По загрузке документа загружаем данные о товарах системы
$(document).ready(function(){
    // Загружаем данныео товарах системы
});

/* ГЛОБАЛЬНЫЕ ИДЕНТИФИКАТОРЫ */
var curIdGoods = 0;
var curIdUserTypes = 0;

/* КНОПКИ МЕНЮ */
// goodsPill - Товары системы
var goodsPillBttn = document.querySelector("#goodsPill");
// userTypesPill - Типы пользователей
var userTypesPillBttn = document.querySelector("#userTypesPill");
// userDiscountPill - Скидки системы
var userDiscountPillBttn = document.querySelector("#userDiscountPill");
// potsPerDayPill - Производимое кол-во горшочков меда в день
var potsPerDayPillBttn = document.querySelector("#potsPerDayPill");

/* ДЕЙСТВИЯ ПО НАЖАТИЮ КНОПОК МЕНЮ */
// Вкладка Товары системы
goodsPillBttn.onclick = function(event){
    console.log("Нажата кнопка Товары системы в панели меню");
    // Получить данные с сервера
}

// Вкладка Типы пользователей
userTypesPillBttn.onclick = function(event){
    console.log("Нажата кнопка Типы пользователей в панели меню");
    // Получить данные с сервера
}

// Вкладка Скидки системы
userDiscountPillBttn.onclick = function(event){
    console.log("Нажата кнопка Скидки системы в панели меню");
    // Получить данные с сервера
    // Прячем div'ы
    var div2 = document.querySelector("#discountChangeTableDiv");
    div2.style.visibility = "hidden";
    var div3 = document.querySelector("#discountInfoChangedDiv");
    div3.style.visibility = "hidden";    
    var bttnsDiv = document.querySelector("#discountChangeButtons");
    bttnsDiv.style.visibility = "hidden";

    editDiscountBttn.disabled = false;
}

// Вкладка Производимый мед
potsPerDayPillBttn.onclick = function(event){
    console.log("Нажата кнопка Производимый мед в панели меню");
    // Затереть данные виджетов
    var potsInput = document.querySelector("#potsInput");
    potsInput.value="";
    var potsInputHelp = document.querySelector("#potsInputHelp");
    forgetPapasPride(potsInput.parentNode);
    potsInputHelp.innerHTML = "Не менее 1 горшочка";

    potsInputInBttn.disabled = false;
    var thxForPotsEditLbl = document.querySelector("#thxForPotsEdit");
    thxForPotsEditLbl.style.visibility = "hidden";
}

/* КНОПКИ СТРАНИЦ */

// Кнопка добавления нового типа пользователя
var addNewUserTypeBttn = document.querySelector("#addNewUserType");
addNewUserTypeBttn.onclick = function(event){
    console.log("Нажата кнопка добавления нового типа пользователя");
    // Открыть модальное окно для заполнения формы - ? убрать событие на кнопку из js
    openUserTypeModal(-1);
}

// Кнопка редактирования скидочной системы
var editDiscountBttn = document.querySelector("#editDiscount");
editDiscountBttn.onclick = function(event){
    console.log("Нажата кнопка редактирования скидочной системы");
    // Отобразить второй блок с виджетами для редактирования
    clearInputsForCommision();
    var div2 = document.querySelector("#discountChangeTableDiv");
    div2.style.visibility = "visible";
    var bttnsDiv = document.querySelector("#discountChangeButtons");
    bttnsDiv.style.visibility = "visible";
    editDiscountBttn.disabled = true;
}

// Сохранение новой скидочной системы
var saveDiscountBttn = document.querySelector("#saveDiscount");
saveDiscountBttn.onclick = function(event){
    console.log("Нажата кнопка сохранения скидочной системы");
    var startDInput = document.querySelector("#startDInput");
    var startDInputHelp = document.querySelector("#startDInputHelp");

    var secondDInput = document.querySelector("#secondDInput");
    var secondDInputHelp = document.querySelector("#secondDInputHelp");

    var thirdDInput = document.querySelector("#thirdDInput");
    var thirdDInputHelp = document.querySelector("#thirdDInputHelp");

    var papa = isCorrectComission(startDInput.value, startDInputHelp);
    makePapaProud(startDInput.parentNode, papa);

    var papasLast = papa;

    papa = isCorrectComission(secondDInput.value, secondDInputHelp);
    makePapaProud(secondDInput.parentNode, papa);
    papasLast = papasLast && papa;

    papa = isCorrectComission(thirdDInput.value, thirdDInputHelp);
    makePapaProud(thirdDInput.parentNode, papa);
    papasLast = papasLast && papa;
    if(papasLast) {
        // Отобразить третий блок с благодарностью и деактивировать кнопки
        var div3 = document.querySelector("#discountInfoChangedDiv");
        div3.style.visibility = "visible";    
        var bttnsDiv = document.querySelector("#discountChangeButtons");
        bttnsDiv.style.visibility = "hidden";
        editDiscountBttn.disabled = true;
    }
}

// Отмена изменений, вносимых в скидочную систему
var cancelNewDiscountBttn = document.querySelector("#cancelNewDiscount");
cancelNewDiscountBttn.onclick = function(event){
    console.log("Нажата кнопка отмены изменений скидочной системы");
    // Очистить формы блока и сделать его невидимым
    clearInputsForCommision();

    var div2 = document.querySelector("#discountChangeTableDiv");
    div2.style.visibility = "hidden";
    var div3 = document.querySelector("#discountInfoChangedDiv");
    div3.style.visibility = "hidden";    
    var bttnsDiv = document.querySelector("#discountChangeButtons");
    bttnsDiv.style.visibility = "hidden";
    editDiscountBttn.disabled = false;
}

// Кнопка обновления количества производимых горшочков
var potsInputInBttn = document.querySelector("#potsInputIn");
potsInputInBttn.onclick = function(event){
    console.log("Нажата кнопка обновления количества производимых горшочков");
    // Проверить введенные данные и вывести сообщение об успешности операции
    var potsInput = document.querySelector("#potsInput");
    var potsInputHelp = document.querySelector("#potsInputHelp");
    var papa = isCorrectInt(potsInput.value, potsInputHelp);
    makePapaProud(potsInput.parentNode,papa);
    if(papa){
        potsInputInBttn.disabled = true;
        var thxForPotsEditLbl = document.querySelector("#thxForPotsEdit");
        thxForPotsEditLbl.style.visibility = "visible";
    }
}

// Кнопка выхода из аккаунта
var logOutBttn = document.querySelector("#logOut");
logOutBttn.onclick = function(event){
    console.log("Нажата кнопка выхода из аккаунта");
}

/* КНОПКИ МОДАЛЬНЫХ ОКОН */
// Сохранить изменения типа товара
var editGoodsSubmitBttn = document.querySelector("#editGoodsSubmit")
editGoodsSubmitBttn.onclick = function(event){
    console.log("Нажата кнопка сохранения изменений в товаре");
}

// Сохранить изменения в типе пользовател
var editAddUserTypeSubmitBttn = document.querySelector("#editAddUserTypeSubmit")
editAddUserTypeSubmitBttn.onclick = function(event){
    console.log("Нажата кнопка сохранения изменений в типе пользователя");
}

var _1 = document.querySelector("#idid")
_1.onclick = editUserType

/* СОБЫТИЯ НА КНОПКИ ТАБЛИЦ */
function editGoods(){
    // Нажата кнопка редактирования товара с идентификатором id
}

function editUserType(){
    var _1 = document.querySelector("#idid")
    var id = _1.parentNode.parentNode.parentNode.id;
    console.log(id);
    // Нажата кнопка редактирования типа пользователя с идентификатором id
}

function removeUserType(){
    // Нажата кнопка удаления типа пользователя с идентификатором id
    // получить таблицу получить роу.роуИндекс
    // из таблицы делитРоу с индексом роуИндекс
}

/**
 * Вставить данные о типах пользователей
 * @param {mass} data - массив объектов, содержащих информацию о типах пользователей
 */
function insertNewDataForUserTypes(data) {
    // Очистить таблицу
    var tableBody = $("#userTypesTableBody");
    tableBody.empty();
    var table = document.getElementById("typesTable");
    for (var i = 0; i < data.length; i++) {
        if(data[i].isDeleted!=0){
            var buttons = document.createElement('div');
            buttons.className = "text-center";
            createButtonsForUserTypes(buttons);        
            console.log(buttons);
            var row = table.insertRow(i);
            var name = row.insertCell(0); // Название
            name.innerHTML = data[i].name;
            var goods = row.insertCell(1); // Товар !!!! Решить вопрос с именем товара
            var c = row.insertCell(2); // Кнопки
            c.appendChild(buttons);
            tableBody.append(row);
        }
    }
}

/**
 * Открыть модальное окно добавления/редактирования типа пользователя
 * @param {number} currentId - текущий идентификатор записи
 */
function openUserTypeModal(currentId){
    var modalHeader = document.querySelector("#editAddUserTypeModalLabel");
    curIdUserTypes = parseInt(currentId.toString());
    if(curIdUserTypes>-1){
        modalHeader.innerHTML = "Редактирование типа пользователя";
    }
    else{
        modalHeader.innerHTML = "Добавление типа пользователя";
    }
}

/**
 * Проверить корректность значения комиссии
 * @param {string} comission - значение, введенное пользователем
 * @param {any} errorPlace - лейбл для отображения сообщения с результатом проверки
 */
function isCorrectComission(comission, errorPlace){
    var reg = new RegExp(`^([1-9]|[1-9][0-9]|(100))$`, '');
    if (comission==null){
        errorPlace.innerHTML = "Введите комиссию, пустое поле";
        return false;
    } 
    if(reg.test(comission)){
        errorPlace.innerHTML = "Корректное значение комиссии";
        return true;
    }
    else {
        errorPlace.innerHTML = "Введите целое число от 1 до 100";
        return false;
    }    
}

/**
 * Проверить корректность значения производимых пчелами горшочков с медом или количество товара для покупки 1 горшочка с медом
 * @param {string} int - значение, введенное пользователем
 * @param {any} errorPlace - лейбл для отображения сообщения с результатом проверки
 */
function isCorrectInt(int, errorPlace){
    var reg = new RegExp(`^([1-9][0-9]*)$`, '');
    if (int==null){
        errorPlace.innerHTML = "Введите количество, пустое поле";
        return false;
    } 
    if(reg.test(int)){
        errorPlace.innerHTML = "Корректное значение";
        return true;
    }
    else {
        errorPlace.innerHTML = "Введите целое число не меньше 1";
        return false;
    }    
}

/**
 * Проверить корректность названия типа пользователя или товара
 * @param {string} name - значение, введенное пользователем
 * @param {any} errorPlace - лейбл для отображения сообщения с результатом проверки
 */
function isCorrectNaming(name, errorPlace){
    var reg = new RegExp(`^([А-Яа-я]{2,20})$`, '');
    if (name==null){
        errorPlace.innerHTML = "Введите название, пустое поле";
        return false;
    } 
    if(reg.test(name)){
        errorPlace.innerHTML = "Корректное название";
        return true;
    }
    else {
        errorPlace.innerHTML = "Введите название на русском языке с длиной от 2 до 20 символов";
        return false;
    }    
}

/**
 * Очистить элементы для ввода комиссии
 */
function clearInputsForCommision() {
    var startDInput = document.querySelector("#startDInput");
    var startDInputHelp = document.querySelector("#startDInputHelp");
    var secondDInput = document.querySelector("#secondDInput");
    var secondDInputHelp = document.querySelector("#secondDInputHelp");
    var thirdDInput = document.querySelector("#thirdDInput");
    var thirdDInputHelp = document.querySelector("#thirdDInputHelp");

    forgetPapasPride(startDInput.parentNode);
    forgetPapasPride(secondDInput.parentNode);
    forgetPapasPride(thirdDInput.parentNode);

    startDInputHelp.innerHTML = "Введите целое число от 1 до 100";
    secondDInputHelp.innerHTML = "Введите целое число от 1 до 100";
    thirdDInputHelp.innerHTML = "Введите целое число от 1 до 100";
}

/**
 * Создать кнопки редактирования и удаления для таблицы типов пользователей
 * @param {any} parentDiv - родительский div, лежащий внутри ячейки таблицы
 */
function createButtonsForUserTypes(parentDiv) {
    // Создаем кнопку редактирования
    // Кнопка
    var editButton = document.createElement('button');
    editButton.className = "btn btn-warning";
    editButton.href = "#editAddUserTypeModal";
    editButton.setAttribute('data-toggle', "modal");
    editButton.setAttribute('data-target', "#editAddUserTypeModal");
    editButton.onclick = editUserType;
    //Спан с карандашом
    var editSpan = document.createElement('span');
    editSpan.className = "glyphicon glyphicon-pencil";
    editSpan.setAttribute('aria-hidden', "true");
    // Вкладываем спан в кнопку
    editButton.appendChild(editSpan);
    // Вкладываем кнопку в див
    buttons.appendChild(editButton);
    // Создаем кнопку удаления
    // Кнопка
    var delButton = document.createElement('button');
    delButton.className = "btn btn-danger";
    //Спан с крестиком
    var delSpan = document.createElement('span');
    delSpan.className = "glyphicon glyphicon-remove";
    delSpan.setAttribute('aria-hidden', "true");
    // Вкладываем спан в кнопку
    delButton.appendChild(delSpan);
    // Вкладываем кнопку в див
    parentDiv.appendChild(delButton);
}