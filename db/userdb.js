var mysql = require('mysql');
var config = require('./config');
var User = require('../model/usermodel');
var Promotion = require('../model/promotion');
var OperationDay = require('../model/operationday.js');

var con = mysql.createConnection({
    host: config["host"],
    port: config["port"],
    user: config["user"],
    password: config["password"],
    database: config["database"]
});

con.connect(function (err) {
    if (err) {
        console.log("Не удалось подключиться к БД");
    } else {
        console.log("Удалось подключиться к БД");
    }
});

/**
 * Получить тип продукта по индексу
 * @param {number} productType - тип продукта пользователя(1,2,3,4)
 */
function getStringProductType(productType) {
    if (productType == 1)
        return "F";
    else if (productType == 2)
        return "B";
    else if (productType == 3)
        return "P";
    else if (productType == 4)
        return "H";
    else
        return null;
}

/**
 * Получить индекс типа продукта из БД
 * @param {string} productType - тип продукта пользователя('F','B','P','H')
 */
function getIndexProductType(productType) {
    if (productType == 'F')
        return 1;
    else if (productType == 'B')
        return 2;
    else if (productType == 'P')
        return 3;
    else
        return 4;
}

/**
 * Зарегистрировать нового пользователя
 * @param {string} loginUser - логин пользователя
 * @param {string} passwordUser - пароль пользователя
 * @param {string} nameUser - имя пользователя
 * @param {string} productTypeUser - тип продукта пользователя('F','B','P','H')
 * @param {function} функция, отправляющая созданного пользователя
 */
function registrationUser(loginUser, passwordUser, nameUser, productTypeUser, callback) {

    // Начинаем транзакцию 
    con.beginTransaction(function (err) {
        if (err) { throw err; }

        // Смотрим тип продукта
        var type = getIndexProductType(productTypeUser);
        // Вставляем пользователя  
        var values = [[loginUser, passwordUser, nameUser, false, 0, 0, type, 1]];
        var sql = "INSERT INTO User(login, password, name, isAdmin, productAmount, honeyAmount, idProductType, idPromotion) VALUES ";
        con.query(sql + mysql.escape(values), function (error, results, fields) {
            if (error) {
                con.commit(function (error) {
                    callback(null);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
                return con.rollback(function () { console.error(error.message); });
            } else {
                // Создаем пользователя и скидку для него
                var user = new User(loginUser, nameUser, productTypeUser);
                user.promotion = new Promotion(1);
                user.promotion.operationsToNext = 5;
                user.promotion.percent = 15;
                user.password = passwordUser;
                user.honeyAmount = 0;
                user.productAmount = 0;

                // Вставляем скидки дл нового пользователя
                con.query("INSERT INTO Promotion(operationsCount, operationsToNext, percent) VALUES(0, 5, 15)", function (error, results, fields) {
                    if (error) return con.rollback(function () { console.error(error.message); });

                    user.promotion.id = results.insertId;

                    // Обновляем id скидки у  пользователя и отправляем в коллбек
                    con.query("UPDATE User SET idPromotion = " + user.promotion.id + " WHERE login = " + mysql.escape(user.login), function (error, results, fields) {
                        if (error) return con.rollback(function () { console.error(error.message); });

                        con.commit(function (error) {
                            callback(user);
                            if (error) return con.rollback(function () { console.error(error.message); });
                        });
                    });
                });
            }
        });
    });
}


/**
 * Залогинить пользователя
 * @param {string} login - логин пользователя
 * @param {string} password - пароль пользователя
 * @param {function} функция, отправляющая созданного пользователя
 */
function loginUser(login, password, callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (err) {
        if (err) { throw err; }
        var sql = " Select * from user where login= "
            + mysql.escape(login) + " And password= " + mysql.escape(password);
        con.query(sql, function (error, results, fields) {
            if (error) {
                con.commit(function (error) {
                    callback(null);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
                return con.rollback(function () { console.error(error.message); });
            } else {
                if (results.length == 0) {
                    con.commit(function (error) {
                        callback(null);
                        if (error) return con.rollback(function () { console.error(error.message); });
                    });
                }
                else {
                    // Получаем скидку пользователя
                    var sql = "Select * from promotion where idPromotion=" + mysql.escape(results[0].idPromotion);
                    con.query(sql, function (error, promotiRes, fields) {
                        if (error) {
                            con.commit(function (error) {
                                callback(null);
                                if (error) return con.rollback(function () { console.error(error.message); });
                            });
                            return con.rollback(function () { console.error(error.message); });
                        } else {

                            // Создаем пользователя и скидку для него
                            var user = new User(results[0].login, results[0].name, getStringProductType(results[0].idProductType));
                            user.promotion = new Promotion(results[0].idPromotion);
                            user.promotion.operationsToNext = promotiRes[0].operationsToNext;
                            user.promotion.percent = promotiRes[0].percent;
                            user.promotion.operationsCount = promotiRes[0].operationsCount;
                            user.password = results[0].password;
                            user.honeyAmount = results[0].honeyAmount;
                            user.productAmount = results[0].productAmount;
                            user.isAdmin = results[0].isAdmin;
                            con.commit(function (error) {
                                callback(user);
                                if (error) return con.rollback(function () { console.error(error.message); });
                            });
                        }
                    });
                }
            }
        });
    });
}   

/**
* Получить все операции ввода средств пользователем за текущий день
* @param {string} login - логин пользователя
* @param {function} функция, создающая запрос
*/
function getTodaysEnterOperations(loginUser, callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (error) {
        if (error) { throw error; }
        // Опеределить временные рамки текущего операционного дня с помощью класса OperationDay
        var opDay = new OperationDay(new Date());
        // Сделать выборку из БД всех операций ввода за текущий день
        var sql = "SELECT o.productAmount "
            + "FROM operation o LEFT OUTER JOIN deal d "
            + "ON o.idOperation = d.idOperation where loginUser= " + mysql.escape(loginUser)
            + " AND o.type='E' "
            + "AND o.date BETWEEN " + mysql.escape(opDay.startDay.toLocaleString()) + " AND " + mysql.escape(opDay.endDay.toLocaleString());


        con.query(sql, function (error, result, fields) {

            if (error) {
                con.commit(function (error) {
                    callback(null);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
                return con.rollback(function () { console.error(error.message); });
            } else {
                con.commit(function (error) {
                    callback(result);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });

            }
        });
    });
}

/**
 * Пополнить счет пользователя его товаром
 * @param {string} login - логин пользователя
 * @param {int} product - количество товара для ввода
 * @param {function} функция, отправляющая полученный баланс
 */
function enterUserProduct(login, product, callback) {
    // Начинаем транзакцию 

    con.beginTransaction(function (error) {
        if (error) { throw error; }

        // Обновить поле с количеством товара пользователя
        var sql = "UPDATE user SET productAmount = productAmount + " + product
            + " WHERE login = " + mysql.escape(login);

        con.query(sql, function (error, result, fields) {

            if (error) {
                con.commit(function (error) {
                    callback(null);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
                return con.rollback(function () { console.error(error.message); });
            } else {
                con.commit(function (error) {
                    callback(result);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
            }
        });
    });
}


/**
 * Потдвердить покупку меда
 * @param {User} user - пользователь с информацией о всем
 * @param {number} countPots - кол-во горшочков меда, которое покупает пользователь
 * @param {function} callback функция, возвращающая новые данные о пользователе, комиссию
 */
function buyHoney(user, countPots, callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (err){
        if (err) { throw err; }

        // обновить кол-во меда и горшочков у пчел
        con.query("UPDATE Bees SET potsCount=potsCount-"+countPots+", honeyInPot=honeyInPot-("+(countPots*0.25).toFixed(5)+") WHERE id=1", function(error, result, fields) {
            if (error) {
                console.log(error.message);
                con.commit(function (error) {
                    callback(null, null);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
                return con.rollback(function () { console.error(error.message); });
            } else {
                // обновить данные у пользователя(баланс) и рассчитать комиссию
                user.buyHoney(countPots);
                var comission = ((countPots * 0.25) * (user.promotion.percent / 100)).toFixed(5);

                // вставить в базу обновленные данные о балансе пользователя
                con.query("UPDATE User SET productAmount="+user.productAmount+", honeyAmount="+user.honeyAmount+" WHERE login="+mysql.escape(user.login), function(error, result, fields) {
                    if(error) {
                        console.log(error.message);
                        con.commit(function (error) {
                            callback(null, null);
                            if (error) return con.rollback(function () { console.error(error.message); });
                        });
                        return con.rollback(function () { console.error(error.message); });
                    } else {
                        // рассчитать новую скидку для следующей покупки
                        user.calculateNewPromotion();
                        // вставить в базу обновленную скидку
                        con.query("UPDATE Promotion SET operationsCount="+user.promotion.operationsCount+", operationsToNext="+user.promotion.operationsToNext+", percent="+user.promotion.percent+" WHERE idPromotion="+user.promotion.id, function(error, result, fields) {
                            if(error) {
                                console.log(error.message);
                                con.commit(function (error) {
                                    callback(null, null);
                                    if (error) return con.rollback(function () { console.error(error.message); });
                                });
                                return con.rollback(function () { console.error(error.message); });
                            } else {
                                callback(user, comission);
                                con.commit(function(error){
                                    if (error) return con.rollback(function () { console.error(error.message); });
                                });
                            }
                        });
                    }
                });
            }
        });

    });
    //как по его балансу так и по его скидке
    // в коллбеке вернуть данные для встваки новой операции в БД
}


/**
 * Получить информацию о покупке меда
 * @param {function} callback функция, возвращающая на клиент информацию о кол-ве горшочков у пчел 
 */
function getInformationForBuying(callback) {
    // получить информцию сколько у пчел горшочков
       // Начинаем транзакцию 
       con.beginTransaction(function (error) {
        if (error) { throw error; }
        // Сделать выборку из БД информации о количестве горшков у пчёл
        var sql = "Select potsCount from bees";
        con.query(sql, function (error, result, fields) {

            if (error) {
                con.commit(function (error) {
                    callback(null);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
                return con.rollback(function () { console.error(error.message); });
            } else {
                con.commit(function (error) {
                    callback(result);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });

            }
        });
    });
}


module.exports.enterUserProduct = enterUserProduct;
module.exports.getTodaysEnterOperations = getTodaysEnterOperations;
module.exports.registrationUser = registrationUser;
module.exports.loginUser = loginUser;
module.exports.getIndexProductType = getIndexProductType;
module.exports.getInformationForBuying = getInformationForBuying;
module.exports.buyHoney = buyHoney;