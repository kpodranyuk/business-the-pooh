/*
* \file Хранит в себе функции, необходимые для работы с отображением личных кабинетов
*/

/**
 * Конвертировать мед в строковое представление
 * @param {any} honey - количество меда
 */
export function translateHoney(honey){
    // console.log(honey.toString());
    var hon = honey.toString();
    if(hon == "0")
        return hon;
    return (parseFloat(hon.replace(",", "."))).toString();
}

/**
 * Проверить корректность количества меда для вывода
 * @param {string} honeyAmount - значение, введенное пользователем
 * @param {number} min - минимально возможное значение
 * @param {number} max - максимально возможное значение
 * @param {any} errorPlace - лейбл для отображения сообщения с результатом проверки
 */
export function isCorrectHoneyAmount(honeyAmount, min, max, errorPlace){
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
export function isCorrectProductAmount(productAmount, min, max, errorPlace){
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
 * Осуществить контроль переходов при открытии страницы бразуера в зависимости от того, залогинен ли пользователь
 */
export function controlPagesForBrowser(){
    // Получаем пользователя,который хранится в браузере
    var user = JSON.parse(localStorage.getItem("currentUser"));
    // Получаем текущую открытую вкладку сайта
    var path = window.location.pathname;
    var page = path.split("/").pop();
    console.log(localStorage.getItem("tabsCount"));
    console.log(user);
    console.log(page);
    if(localStorage.getItem("tabsCount")!=null && parseInt(localStorage.tabsCount)>1){
        console.log( window.location.href );
        // Если в хранилище бразуера есть текущий пользователь
        if(user!=null){
            // Перенаправляем его на страницу с ошибкой
            //window.location = '/sorry.html';
            return false;
        }
        // Если пользователь еще не совершил вход, отправляем его на главную страницу
        else{        
            if(page!="index.html"){
                // Перенаправить на главную страницу
                window.location = '/index.html';
            }
        }
    }
    else if(localStorage.getItem("tabsCount")!=null && parseInt(localStorage.tabsCount)===1){
        // Отправить пользователя в его ЛК
        console.log('here')
        whereToGo(user, page);
        return true;
    }
}

function whereToGo(user, curPage){
    if (user!=null){
        if(user.login==="admin")
            window.location = '/adminLk.html';
        else if(user.isAdmin && curPage!= 'poohLk.html'){
            window.location = '/poohLk.html';
        }
        else if(!user.isAdmin && curPage!= 'userLk.html'){
            window.location = '/userLk.html';
        }
    }
    else if(curPage != 'index.html')
        window.location = '/index.html';
}