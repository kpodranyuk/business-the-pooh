import {makePapaProud, forgetPapasPride} from "./formControl.js";
import * as adminLkApi from "./adminLkApi.js";

// По загрузке документа загружаем данные о товарах системы
$(document).ready(function(){
    // Загружаем данныео товарах системы
    goodsPillBttn.click();
});

/* ГЛОБАЛЬНЫЕ ИДЕНТИФИКАТОРЫ */
var curIdGoods = -1;
var curIdUserTypes = -1;

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
    curIdGoods = -1;
    // Очистить таблицу
    var tableBody = $("#userTypesTableBody");
    tableBody.empty();
    // Получить данные с сервера
    adminLkApi.getProductTypes(function(productTypes) {
        insertNewDataForGoods(productTypes);
    });
}

// Вкладка Типы пользователей
userTypesPillBttn.onclick = function(event){
    curIdUserTypes=-1;
    // Очистить таблицу
    var tableBody = $("#goodsTableBody");
    tableBody.empty();
    console.log("Нажата кнопка Типы пользователей в панели меню");
    // Получить данные с сервера
    adminLkApi.getUserTypes(function(userTypes) {
        insertNewDataForUserTypes(userTypes);
    });
}

// Вкладка Скидки системы
userDiscountPillBttn.onclick = function(event){
    console.log("Нажата кнопка Скидки системы в панели меню");
    // Получить данные с сервера
    adminLkApi.getCommission(function(commission) {
        document.querySelector("#startD").innerHTML = commission[0];
        document.querySelector("#secondD").innerHTML = commission[1];
        document.querySelector("#thirdD").innerHTML = commission[2];
    });
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
    // Текущее количество горшочков
    var potsForNow = document.querySelector("#potsForNow");
    // ВСТАВИТЬ ЗНАЧЕНИЕ С СЕРВЕРА
    adminLkApi.getPots(function(pots){
        document.querySelector("#potsForNow").innerHTML = pots;
    });
    potsForNow.value="";    
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
        // Сохраняем скидки
        adminLkApi.editCommission(Number(startDInput.value), Number(secondDInput.value), Number(thirdDInput.value), function(success) {
            if (success) {
                adminLkApi.getCommission(function(commission) {
                    document.querySelector("#startD").innerHTML = commission[0];
                    document.querySelector("#secondD").innerHTML = commission[1];
                    document.querySelector("#thirdD").innerHTML = commission[2];
                });
            } else {
                console.log("Не удалось сохранить комиссию");
            }
        });
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
        adminLkApi.editPots(Number(potsInput.value), function(success) {
            if (success) {
                adminLkApi.getPots(function(pots){
                    document.querySelector("#potsForNow").innerHTML = pots;
                });
            } else {
                console.log("Не удалось сохранить комиссию");
            }
        });
        potsInputInBttn.disabled = true;
        var thxForPotsEditLbl = document.querySelector("#thxForPotsEdit");
        thxForPotsEditLbl.style.visibility = "visible";
    }
}

// Кнопка выхода из аккаунта
var logOutBttn = document.querySelector("#logOut");
logOutBttn.onclick = function(event){
    console.log("Нажата кнопка выхода из аккаунта");
    // Очищаем хранилище
    localStorage.clear();
    // Переходим на главную страницу
    window.location = "/";
}

/* КНОПКИ МОДАЛЬНЫХ ОКОН */
// Сохранить изменения типа товара
var editGoodsSubmitBttn = document.querySelector("#editGoodsSubmit")
editGoodsSubmitBttn.onclick = function(event){
    event.preventDefault();
    console.log("Нажата кнопка сохранения изменений в товаре");
    // Проверить введенные поля
    var goodsInputName = document.querySelector("#goodsInputName");
    var goodsInputNameHelp = document.querySelector("#goodsInputNameHelp");
    var wasPapaProud = isCorrectNaming(goodsInputName.value, goodsInputNameHelp);
    makePapaProud(goodsInputName.parentNode, wasPapaProud);
    var papa = wasPapaProud;

    var goodsInputCourse = document.querySelector("#goodsInputCourse");
    var goodsInputCourseHelp = document.querySelector("#goodsInputCourseHelp");
    wasPapaProud = isCorrectInt(goodsInputCourse.value, goodsInputCourseHelp);
    makePapaProud(goodsInputCourse.parentNode, wasPapaProud);
    papa = wasPapaProud && papa;
    if(papa){
        // Отправить запрос на сервер
        adminLkApi.editProduct(curIdGoods,goodsInputName.value,goodsInputCourse.value,function(result, error){
            if(result){
                //return false;
                goodsPillBttn.click();
            } else {
                alert(error);
            }
        });
    }
    else
        return false;
}

// Сохранить изменения в типе пользовател
var editAddUserTypeSubmitBttn = document.querySelector("#editAddUserTypeSubmit")
editAddUserTypeSubmitBttn.onclick = function(event){
    event.preventDefault();
    console.log("Нажата кнопка сохранения изменений в типе пользователя");
    if(curIdUserTypes<0){
        // Добавление типа пользователя
        // Проверить введенные поля
        var userTypeInputName = document.querySelector("#userTypeInputName");
        var userTypeInputNameHelp = document.querySelector("#userTypeInputNameHelp");
        var wasPapaProud = isCorrectNaming(userTypeInputName.value, userTypeInputNameHelp);
        makePapaProud(userTypeInputName.parentNode, wasPapaProud);

        if(wasPapaProud){
            // Отправить запрос на сервер
            adminLkApi.addUser(userTypeInputName.value,getProductIdForCurUser(),function(result, error){
                if(result){
                    //return false;
                    //userTypesPillBttn.click();
                    console.log("cool");
                    // Получить данные с сервера
                    adminLkApi.getUserTypes(function(userTypes) {
                        insertNewDataForUserTypes(userTypes);
                    });
                    return false;
                } else {
                    alert(error);
                }
            });
        }
        else
            return false;
    }
    else{
        // Редактирование типа пользователя
        // Проверить введенные поля
        var userTypeInputName = document.querySelector("#userTypeInputName");
        var userTypeInputNameHelp = document.querySelector("#userTypeInputNameHelp");
        var wasPapaProud = isCorrectNaming(userTypeInputName.value, userTypeInputNameHelp);
        makePapaProud(userTypeInputName.parentNode, wasPapaProud);

        if(wasPapaProud){
            // Отправить запрос на сервер
            adminLkApi.editUser(getCurUserTypeName(),userTypeInputName.value,getProductIdForCurUser(),function(result, error){
                if(result){
                    //return false;
                    //userTypesPillBttn.click();
                    console.log("cool");
                    // Получить данные с сервера
                    adminLkApi.getUserTypes(function(userTypes) {
                        insertNewDataForUserTypes(userTypes);
                    });
                    return false;
                } else {
                    alert(error);
                }
            });
        }
        else
            return false;
    }
}

/* СОБЫТИЯ НА КНОПКИ ТАБЛИЦ */
function editGoods(){
    // Нажата кнопка редактирования товара с идентификатором id
    var id = 0;
    console.log(event.target.getAttribute('class'))
    if(event.target.getAttribute('class') == "btn btn-warning"){
        id = event.target.parentNode.parentNode.parentNode.id;
        console.log(event.target.parentNode.parentNode.parentNode)
    }
    else {
        id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(event.target.parentNode.parentNode.parentNode.parentNode)
    }
    curIdGoods = id;
    console.log(curIdGoods)
}

function editUserType(event){
    // Нажата кнопка редактирования типа пользователя с идентификатором id
    var id = 0;
    console.log(event.target.getAttribute('class'))
    if(event.target.getAttribute('class') == "btn btn-warning"){
        id = event.target.parentNode.parentNode.parentNode.id;
        console.log(event.target.parentNode.parentNode.parentNode)
    }
    else {
        id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(event.target.parentNode.parentNode.parentNode.parentNode)
    }
    curIdUserTypes = id;
    openUserTypeModal(curIdUserTypes);
    console.log(curIdUserTypes)
}

function removeUserType(){
    // Нажата кнопка удаления типа пользователя с идентификатором id
    var id = 0;
    console.log(event.target.getAttribute('class'))
    if(event.target.getAttribute('class') == "btn btn-danger"){
        id = event.target.parentNode.parentNode.parentNode.id;
        console.log(event.target.parentNode.parentNode.parentNode)
    }
    else {
        id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(event.target.parentNode.parentNode.parentNode.parentNode)
    }
    curIdUserTypes = id;
    console.log(id)
    var name = document.getElementById(id).cells[0].innerHTML;
    var rowIndex = document.getElementById(id).rowIndex;
    // Отправить запрос на сервер
    adminLkApi.deleteUser(name,function(result){
        if(result){
            //return false;
            //userTypesPillBttn.click();
            console.log("cool");
            // Получить данные с сервера
            adminLkApi.getUserTypes(function(userTypes) {
                insertNewDataForUserTypes(userTypes);
            });
            return false;
        }
    });
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
        if(data[i].isDeleted==0){
            var buttons = document.createElement('div');
            buttons.className = "text-center";
            createButtonsForUserTypes(buttons);        
            console.log(buttons);
            var row = table.insertRow(i);
            row.id = i;
            var name = row.insertCell(0); // Название
            name.innerHTML = data[i].name;
            var goods = row.insertCell(1); // Товар !!!! Решить вопрос с именем товара
            goods.innerHTML = findProductName(data[i].productType); // Находим имя товара
            var c = row.insertCell(2); // Кнопки
            c.appendChild(buttons);
            tableBody.append(row);
        }
    }
}

/**
 * Вставить данные о товарах
 * @param {mass} data - массив объектов, содержащих информацию о типах пользователей
 */
function insertNewDataForGoods(data) {
    // Очистить таблицу
    var tableBody = $("#goodsTableBody");
    tableBody.empty();
    var table = document.getElementById("goodsTable");
    for (var i = 0; i < data.length; i++) {
        var buttons = document.createElement('div');
        buttons.className = "text-center";
        createEditGoodsButton(buttons);        
        console.log(buttons);
        var row = table.insertRow(i);
        row.id = data[i].idProductType;
        var name = row.insertCell(0); // Название
        name.innerHTML = data[i].name;
        var goods = row.insertCell(1); // Предмет обмена
        goods.innerHTML = getStringType(data[i].type);
        var course = row.insertCell(2); // Курс обмена
        course.innerHTML = data[i].rate;
        var c = row.insertCell(3); // Кнопки
        c.appendChild(buttons);
        tableBody.append(row);
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
    // Добавить информацию о товарах
    var select = document.querySelector("#goodsTypesSelect");
    var option;
    while (select.length > 0) {
        select.remove(select.length-1);
    }
    var pTypes = adminLkApi.data.productTypes;
    for (var i = 0; i < pTypes.length; i++) {
        option = document.createElement("option");
        option.text = pTypes[i].name;
        select.add(option);
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
    parentDiv.appendChild(editButton);
    // Создаем кнопку удаления
    // Кнопка
    var delButton = document.createElement('button');
    delButton.className = "btn btn-danger";
    delButton.onclick = removeUserType;
    //Спан с крестиком
    var delSpan = document.createElement('span');
    delSpan.className = "glyphicon glyphicon-remove";
    delSpan.setAttribute('aria-hidden', "true");
    // Вкладываем спан в кнопку
    delButton.appendChild(delSpan);
    // Вкладываем кнопку в див
    parentDiv.appendChild(delButton);
}

/**
 * Создать кнопку редактирования для товара
 * @param {any} parentDiv - родительский div, лежащий внутри ячейки таблицы
 */
function createEditGoodsButton(parentDiv) {
    // Создаем кнопку редактирования
    // Кнопка
    var editButton = document.createElement('button');
    editButton.className = "btn btn-warning";
    editButton.href = "#editGoodsModal";
    editButton.setAttribute('data-toggle', "modal");
    editButton.setAttribute('data-target', "#editGoodsModal");
    editButton.onclick = editGoods;
    //Спан с карандашом
    var editSpan = document.createElement('span');
    editSpan.className = "glyphicon glyphicon-pencil";
    editSpan.setAttribute('aria-hidden', "true");
    // Вкладываем спан в кнопку
    editButton.appendChild(editSpan);
    // Вкладываем кнопку в див
    parentDiv.appendChild(editButton);
}

/**
 * Получить имя товара по его идентификатору
 * @param {any} productTypeId - родительский div, лежащий внутри ячейки таблицы
 */
function findProductName(productTypeId){
    var pTypes = adminLkApi.data.productTypes;
    for (var i = 0; i < pTypes.length; i++) {
        if(pTypes[i].idProductType === productTypeId)
            return pTypes[i].name;
    }
    return "";
}

function getCurUserTypeName(){
    if(curIdUserTypes>-1){
        var row = document.getElementById(curIdUserTypes);
        console.log(curIdUserTypes);
        var name = row.cells[0].innerHTML;
        console.log(name);
        return name;
    }
    return "";
}

function getProductIdForCurUser(){
    var val = $("#goodsTypesSelect").val();
    var pTypes = adminLkApi.data.productTypes;
    for (var i = 0; i < pTypes.length; i++) {
        if(pTypes[i].name === val){
            console.log(pTypes[i].idProductType)
            return pTypes[i].idProductType;
        }
            
    }
    return -1;
}

function getStringType(type) {
    if(type == "F") {
        return "Цветочек";
    } else if (type == "B") {
        return "Шарик";
    } else if (type == "P") {
        return "Горшочек";
    }

}