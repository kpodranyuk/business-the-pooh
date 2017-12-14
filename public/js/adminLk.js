import {makePapaProud, forgetPapasPride} from "./formControl.js";

// По загрузке документа загружаем данные о товарах системы
$(document).ready(function(){
    // Загружаем данныео товарах системы
});

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
    var papa = isCorrectPotsCount(potsInput.value, potsInputHelp);
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

/**
 * Открыть модальное окно добавления/редактирования типа пользователя
 * @param {number} currentId - текущий идентификатор записи
 */
function openUserTypeModal(currentId){
    var modalHeader = document.querySelector("#editAddUserTypeModalLabel");
    if(parseInt(currentId.toString())>-1){
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
 * Проверить корректность значения производимых пчелами горшочков с медом
 * @param {string} potsCount - значение, введенное пользователем
 * @param {any} errorPlace - лейбл для отображения сообщения с результатом проверки
 */
function isCorrectPotsCount(potsCount, errorPlace){
    var reg = new RegExp(`^([1-9][0-9]*)$`, '');
    if (potsCount==null){
        errorPlace.innerHTML = "Введите количество горшочков, пустое поле";
        return false;
    } 
    if(reg.test(potsCount)){
        errorPlace.innerHTML = "Корректное значение количества горшочков";
        return true;
    }
    else {
        errorPlace.innerHTML = "Введите целое число не меньше 1";
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