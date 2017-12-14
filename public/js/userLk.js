import * as userApi from "./userLkApi.js";
import * as commonLk from "./commonLk.js";
import {makePapaProud, forgetPapasPride, isCorrectPassword, isSecondPswdTheSame} from "./formControl.js";

// Создание сокетного соединения
var socket = io.connect();
var currentPill = "enterPill";
var maxPots = 0;

// По загрузке документа заполняем элементы, отображающие информацию о пользователе
$(document).ready(function(){
    // TODO сделать функцию для работы с localStorage
    // Устанавливаем информацию о пользователе
    // userImage loginDropdown userTypeName productLabel honeyLabel
    // Устанавливаем изображение(там функцию я удалил)
    //$("#userImage").attr("src",getUserImagePath(userApi.curUser.productType));
    // Устанавливаем логин
    $("#loginDropdown").text(userApi.curUser.login);
    // Устанавливаем тип пользователя и имя
    $("#userTypeName").text(userApi.curUser.userType.name+" "+userApi.curUser.name);
    setUserBalance();

    enterPillBttn.click();
});

function setUserBalance(){
    // Устанавливаем количество товара пользователя
    $("#productLabel").text(userApi.curUser.productAmount + " шт.");
    // Устанавливаем количество меда пользователя
    $("#honeyLabel").text(commonLk.translateHoney(userApi.curUser.honeyAmount).toString()+" л меда");
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
        wasPapaProud = commonLk.isCorrectHoneyAmount(honeyCount.value, $("#honeyInput").attr('min'), $("#honeyInput").attr('max'), honeyCountHelp);
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
        wasPapaProud = commonLk.isCorrectProductAmount(productCount.value, $("#goodsInput").attr('min'), $("#goodsInput").attr('max'), productCountHelp);
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
        maxPots = 0;
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
                forgetPapasPride(sel.parentNode);
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
                forgetPapasPride(inp.parentNode);
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
                forgetPapasPride(inp.parentNode);
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
    forgetPapasPride(pswdInput.parentNode);
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
        $("#productCountToBuy").text((Number($("#selectPots").val()) * userApi.curUser.userType.productType.rate).toString() + " шт.");
        $("#comissionSizeForBuy").text((+(((Number($("#selectPots").val())*0.25*(Number(userApi.curUser.promotion.percent)/100))).toFixed(5))).toString());
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
    currentPill = "accPill";
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
            $("#accName").text(userApi.curUser.name);
            $("#accLogin").text(userApi.curUser.login);
            var pass = "";
            for (var i = 0 ; i < userApi.curUser.password.length; i++)
                pass += "*";
            $("#accPassword").text(pass);
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
        else {
            userApi.updatePassword(newpswdInput.value, function (result) {
                if(result == true) {
                    var div = document.querySelector("#pswdDiv");    
                    div.style.visibility = "hidden";
                    var pass = "";
                    for (var i = 0 ; i < userApi.curUser.password.length; i++)
                        pass += "*";
                    $("#accPassword").text(pass);
                }
            });
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
    forgetPapasPride(pswdInput.parentNode);
}

// Деактивировать аккаунт
forgetMeBttn.onclick = function(event){
    event.preventDefault();
    // Осуществляем проверку пароля на корректность
    var pswdInput = document.querySelector("#enterPswd");
    var pswdInputHelp = document.querySelector("#enterPswdHelp");
    var wasPapaProud = false;
    wasPapaProud = isCorrectPassword(pswdInput.value, pswdInputHelp);
    makePapaProud(pswdInput.parentNode, wasPapaProud);
    // Если пароль корректный, TODO деактивировать пользователя
    if(wasPapaProud){
		if(pswdInput.value == userApi.curUser.password){
            console.log("Деактивация");
            userApi.deactivateAccount(function (success) {
                socket.emit('leave', { username: userApi.curUser.login });
                localStorage.clear();
                window.location = "/";
            });
		}
		else{
			makePapaProud(pswdInput.parentNode, false);
			pswdInputHelp.innerHTML = "Неверный пароль";
			return false;
		}        
    }
	return false;
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
    forgetPapasPride(curpswdInput.parentNode);

    // Затем новый
    var newpswdInput = document.querySelector("#newPswdInput");
    newpswdInput.value = "";
    var newpswdInputHelp = document.querySelector("#newPswdInputHelp");
    newpswdInputHelp.innerHTML = "";
    forgetPapasPride(newpswdInput.parentNode);

    // Затем повтор нового
    var newRepeatPswdInput = document.querySelector("#newPswdInputRepeat");
    newRepeatPswdInput.value = "";
    var newRepeatPswdInputHelp = document.querySelector("#newPswdInputRepeatHelp");
    newRepeatPswdInputHelp.innerHTML = "";
    forgetPapasPride(newRepeatPswdInput.parentNode);
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
        userApi.buyHoneyInfo(function(result) {
            var pots = result;
            if (maxPots != pots) {
                maxPots = pots;
                buyPillBttn.click();
            }
        });
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