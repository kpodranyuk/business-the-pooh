// Изображение пчелы при выводе меда
var beeOut = document.querySelector("#outbee");
console.log(beeOut);

// Анимация пчелы при выводе меда
var outAnime = anime({
    targets: beeOut,
    rotate: '1turn',
    autoplay: false,
    complete: function(anim) {
        // СОБЫТИЕ ЗАВЕРШЕНИЯ АНИМАЦИИ ПРИ ВЫВОДЕ МЕДА
        console.log("Нажата кнопка вывода меда");
      }
});

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