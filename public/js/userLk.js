// Переключение на скрытую вкладку с настройками аккаунта
var acc_bttn = document.querySelector("#cont");
console.log(acc_bttn);
acc_bttn.onclick=function(event){
    $('#pills a[href="#trueAcc"]').tab('show')
}

// Изображение пчелы при выводе меда
var bee_out = document.querySelector("#outbee");
console.log(bee_out);

// Изображение пчелы при вводе товара
var bee_in = document.querySelector("#inbee");
console.log(bee_in);

// Анимация пчелы при вводе товара
var inAnime = anime({
    targets: bee_in,
    rotate: '1turn',
    autoplay: false,
    direction: 'reverse',
    duration: 1200,
    begin: function(anim) {
        // СОБЫТИЕ ЗАВЕРШЕНИЯ АНИМАЦИИ ПРИ ВВОДЕ ТОВАРА
        console.log("Нажата кнопка ввода товара");
        // Проверить введенное количество меда
        var productCount = document.querySelector("#goodsInput");
        console.log(productCount);
        var productCountHelp = document.querySelector("#goodsInputHelp");
        console.log(productCountHelp);
        var wasPapaProud = false;
        wasPapaProud = isCorrectProductAmount(productCount.value, productCountHelp);
        makePapaProud(productCount.parentNode, wasPapaProud);
      }
});

// Анимация пчелы при выводе меда
var outAnime = anime({
    targets: bee_out,
    rotate: '1turn',
    autoplay: false,
    duration: 800,
    begin: function(anim) {
        // СОБЫТИЕ ЗАВЕРШЕНИЯ АНИМАЦИИ ПРИ ВЫВОДЕ МЕДА
        console.log("Нажата кнопка вывода меда");
        // Проверить введенное количество меда
        var honeyCount = document.querySelector("#honeyInput");
        console.log(honeyCount);
        var honeyCountHelp = document.querySelector("#honeyInputHelp");
        console.log(honeyCountHelp);
        var wasPapaProud = false;
        wasPapaProud = isCorrectHoneyAmount(honeyCount.value, honeyCountHelp);
        makePapaProud(honeyCount.parentNode, wasPapaProud);
      }
});

// Кнопка вывода меда
var out_bttn = document.querySelector("#honeyOut");
out_bttn.onclick=outAnime.restart;

// Кнопка ввода товара
var in_bttn = document.querySelector("#honeyIn");
in_bttn.onclick=inAnime.restart;

var logOutBttn = document.querySelector("#logOut");
logOutBttn.onclick = function(event){
    console.log("Нажата кнопка выхода из аккаунта");
}

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

function isCorrectHoneyAmount(honeyAmount, errorPlace){
    console.log("I'm in isCorrectHoneyAmount");
    var reg = new RegExp(`^[0-5]([.,][0-9]{1,3})?$`, '');
    if (honeyAmount==null){
        console.log("honeyAmount is null");
        errorPlace.innerHTML = "Введите количество меда, пустое поле";
        return false;
    } 
    if(reg.test(honeyAmount)){
        if (parseFloat(honeyAmount)<0.005 || parseFloat(honeyAmount)>5.0){
            console.log("wrong amount of honeyAmount");
            errorPlace.innerHTML = "Количество меда не должно быть меньше 0.005 и больше 5.0";
            return false;
        }
        console.log("true, correct honeyAmount");
        errorPlace.innerHTML = "Корректное количество меда";
        return true;
    }
    else {
        console.log("wrong, incorrect honeyAmount");
        errorPlace.innerHTML = "Некорректное количество меда.<br>Количество меда должно быть положительным числом меньше 5";
        return false;
    }    
}

function isCorrectProductAmount(productAmount, errorPlace){
    console.log("I'm in isCorrectProductAmount");
    var reg = new RegExp(`^[1-9]|([1-5][0-9])$`, '');
    if (productAmount==null){
        console.log("productAmount is null");
        errorPlace.innerHTML = "Введите количество товара, пустое поле";
        return false;
    } 
    if(reg.test(productAmount)){
        if (parseInt(productAmount)<1 || parseInt(productAmount)>50){
            console.log("wrong amount of productAmount");
            errorPlace.innerHTML = "Количество товара не должно быть меньше 1 и больше 50";
            return false;
        }
        console.log("true, correct productAmount");
        errorPlace.innerHTML = "Корректное количество товара";
        return true;
    }
    else {
        console.log("wrong, incorrect productAmount");
        errorPlace.innerHTML = "Некорректное количество товара.<br>Количество товара должно быть положительным целым числом не больше 50";
        return false;
    }    
}