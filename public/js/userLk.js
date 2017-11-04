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
    complete: function(anim) {
        // СОБЫТИЕ ЗАВЕРШЕНИЯ АНИМАЦИИ ПРИ ВВОДЕ ТОВАРА
      }
});

// Анимация пчелы при выводе меда
var outAnime = anime({
    targets: bee_out,
    rotate: '1turn',
    autoplay: false,
    complete: function(anim) {
        // СОБЫТИЕ ЗАВЕРШЕНИЯ АНИМАЦИИ ПРИ ВЫВОДЕ МЕДА
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