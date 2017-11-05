/*ПОДКЛЮЧЕНИЕ МОДУЛЕЙ*/
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var indexRoute = require('./routes/indexRoute');
var userRoute = require('./routes/userRoute');
var poohRoute = require('./routes/poohRoute');
var loginRoute = require('./routes/loginRoute');
var registerRoute = require('./routes/registerRoute');
var userApiRoute = require('./routes/userApiRoute');
var commonApiRoute = require('./routes/commonApiRoute');
var poohApiRoute = require('./routes/poohApiRoute');
var common = require('./model/common');


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
app.use('/', indexRoute);
app.use('/userLk', userRoute);
app.use('/poohLk', poohRoute);
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/api/user', userApiRoute);
app.use('/api/common', commonApiRoute);
app.use('/api/pooh', poohApiRoute);

// Сокеты для генерации событий для клиента
io.sockets.on('connection', function (socket) {
  console.log('Client connected to socket server.');
  socket.on('join', function (data) {
    socket.join(data.username);
    console.log("Client " + data.username + " Joined");
  });

});

// Обновляем операционный день
setInterval(function() {
  common.updateOperationDay(io);
}, 1200);