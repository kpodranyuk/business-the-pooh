/*ПОДКЛЮЧЕНИЕ МОДУЛЕЙ*/
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path = require("path");
var api = require('./app_server/routes/router.js');


/*СОЗДАНИЕ ПРИЛОЖЕНИЯ*/
var app = express();

/*СТАТИЧЕСКИЕ ФАЙЛЫ ПРИЛОЖЕНИЯ*/
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/static/resources'));

//Подключение json парсера
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*ЗАПУСК СЕРВЕРА*/
var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);
var io = require('socket.io').listen(server);
app.io = io;
server.listen(port, function () {
  console.log('server is running on port ' + port);
});


/*МАРШРУТИЗАЦИЯ*/
app.use(function (req, res, next) {
  req.io = io;
  next();
});

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/static/resources/index.html'));
});

app.get('/userLk', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/static/resources/userLk.html'));
});

app.use('/api', api);

// Сокеты для генерации событий для клиента
io.sockets.on('connection', function (socket) {
  console.log('Client connected to socket server.');
  socket.on('join', function (data) {
    socket.join(data.username);
    console.log("Client " + data.username + " Joined");
  });
  socket.on('leave', function (data) {
    socket.leave(data.username);
    console.log("Client " + data.username + " Left");
  });

});