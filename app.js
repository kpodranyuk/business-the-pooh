/*ПОДКЛЮЧЕНИЕ МОДУЛЕЙ*/
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var indexRoute = require('./routes/indexRoute');
var poohRoute = require('./routes/poohRoute');
var loginRoute = require('./routes/loginRoute');
var registerRoute = require('./routes/registerRoute');


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
app.use('/userLk', userRoute);
app.use('/poohLk', poohRoute);
app.use('/login', loginRoute);
app.use('/register', registerRoute);

