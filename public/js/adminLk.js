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

/* ДЕЙСТВИЯ ПО НАЖАТИЮ КНОПОК МЕНЮ */
// Вкладка Товары системы
goodsPillBttn.onclick = function(event){
    console.log("Нажата кнопка Товары системы в панели меню");
    // Получить данные с сервера
}

// Вкладка Товары системы
userTypesPillBttn.onclick = function(event){
    console.log("Нажата кнопка Типы пользователей в панели меню");
    // Получить данные с сервера
}

// Вкладка Товары системы
userDiscountPillBttn.onclick = function(event){
    console.log("Нажата кнопка Скидки системы в панели меню");
    // Получить данные с сервера
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
}

// Сохранение новой скидочной системы
var saveDiscountBttn = document.querySelector("#saveDiscount");
saveDiscountBttn.onclick = function(event){
    console.log("Нажата кнопка сохранения скидочной системы");
    // Отобразить третий блок с благодарностью и деактивировать кнопки
}

// Отмена изменений, вносимых в скидочную систему
var cancelNewDiscountBttn = document.querySelector("#cancelNewDiscount");
cancelNewDiscountBttn.onclick = function(event){
    console.log("Нажата кнопка отмены изменений скидочной системы");
    // Очистить формы блока и сделать его невидимым
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