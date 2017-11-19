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
 * @param {any} errorPlace - лейбл для отображения сообщения с результатом проверки
 */
export function isCorrectHoneyAmount(honeyAmount, errorPlace){
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