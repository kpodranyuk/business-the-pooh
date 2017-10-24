/*ПОДКЛЮЧЕНИЕ МОДУЛЕЙ*/

var express = require('express');
var http = require('http');

/*СОЗДАНИЕ ПРИЛОЖЕНИЯ*/
var app = express();

/*ЗАПУСК СЕРВЕРА*/
var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);
server.listen(port, function(){
  console.log('server is running on port '  + port);
});


/*МАРШРУТИЗАЦИЯ*/



/*СТАТИЧЕСКИЕ ФАЙЛЫ ПРИЛОЖЕНИЯ*/
app.use(express.static(__dirname + '/public'));
