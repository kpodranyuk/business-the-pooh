/*ПОДКЛЮЧЕНИЕ МОДУЛЕЙ*/
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var indexRoute = require('./routes/indexRoute');


/*СОЗДАНИЕ ПРИЛОЖЕНИЯ*/
var app = express();

/*СТАТИЧЕСКИЕ ФАЙЛЫ ПРИЛОЖЕНИЯ*/
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/static/resources'));

//Подключение json парсера
app.use(bodyParser.json());

/*ЗАПУСК СЕРВЕРА*/
var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);
server.listen(port, function(){
  console.log('server is running on port '  + port);
});


/*МАРШРУТИЗАЦИЯ*/
app.use('/', indexRoute);


app.get('/userLk', function(req, res) {
	
	res.sendfile('static/resources/userLk.html');
});

app.get('/poohLk', function(req, res) {
	
	res.sendfile('static/resources/poohLk.html');
});