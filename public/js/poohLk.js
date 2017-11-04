// Изображение пчелы при выводе меда
var bee_out = document.querySelector("#outbee");
console.log(bee_out);

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