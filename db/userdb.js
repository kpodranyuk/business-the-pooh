var mysql = require('mysql');
var User = require('../model/usermodel');
var Promotion = require('../model/promotion');
var OperationDay = require('../model/operationday.js');
var con = require("./connection");
var common = require('../model/common');
var dataCommision = require('../model/datapromotionandpots');


/**
 * Деактивировать аккаунт пользователя
 * @param {string} login 
 */
function deactivateAccount(login, callback) {
    con.beginTransaction(function (error) {
        if (error) { throw error; }
        var sql = "UPDATE User SET isDeactivation=1 WHERE login=" + mysql.escape(login);
        con.query(sql, function (error, result) {
            if (error) {
                con.commit(function (error) {
                    callback(false);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
                return con.rollback(function () { console.error(error.message); });
            } else {
                con.commit(function (error) {
                    callback(true);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
            }
        });
    });
}

/**
* Обновлять пароль пользователя в БД
* @param {string} loginUser - логин пользователя
* @param {string} passwordUser - пароль пользователя
* @param {function} функция обратного вызова
*/
function updatePassword(loginUser, passwordUser, callback) {
    con.beginTransaction(function (error) {
        if (error) { throw error; }
        var sql = "UPDATE User SET password=" + mysql.escape(passwordUser) + " WHERE login=" + mysql.escape(loginUser);
        con.query(sql, function (error, result) {
            if (error) {
                con.commit(function (error) {
                    callback(false);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
                return con.rollback(function () { console.error(error.message); });
            } else {
                con.commit(function (error) {
                    callback(true);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
            }
        });
    });
}

/**
 * Зарегистрировать нового пользователя
 * @param {string} loginUser - логин пользователя
 * @param {string} passwordUser - пароль пользователя
 * @param {string} nameUser - имя пользователя
 * @param {string} userType - тип пользователя
 * @param {function} функция, отправляющая созданного пользователя
 */
function registrationUser(loginUser, passwordUser, nameUser, userType, callback) {

    // Начинаем транзакцию 
    con.beginTransaction(function (err) {

        if (err) { throw err; }

        // Смотрим тип продукта
        // Вставляем пользователя  
        var values = [[loginUser, passwordUser, nameUser, false, 0, 0, false, 1, userType]];
        var sql = "INSERT INTO User(login, password, name, isAdmin, productAmount, honeyAmount, isDeactivation, idPromotion, nameUserType) VALUES ";
        con.query(sql + mysql.escape(values), function (error, results, fields) {
            if (error) {
                con.commit(function (error) {
                    callback(null);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
                return con.rollback(function () { console.error(error.message); });
            } else {
    
                var comission = dataCommision.getCommission();
                var valuesPromotion = [[0, 10, comission[0], comission[0], comission[1], comission[2]]];
                var sql = "INSERT INTO Promotion(operationsCount, operationsToNext, percent, firstCommission, secondCommission, thirdCommission)"
                    +" VALUES ";
                // Вставляем скидки дл нового пользователя
                con.query(sql + mysql.escape(valuesPromotion), function (error, results, fields) {
                    if (error) return con.rollback(function () { console.error(error.message); });

                    var id = results.insertId;

                    // Обновляем id скидки у  пользователя и отправляем в коллбек
                    con.query("UPDATE User SET idPromotion = " + id + " WHERE login = " + mysql.escape(loginUser), function (error, results, fields) {
                        if (error) return con.rollback(function () { console.error(error.message); });

                        con.commit(function (error) {
                            callback(true);
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
                            var user = new User(results[0].login, results[0].name, common.getStringProductType(results[0].idProductType));
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
    con.beginTransaction(function (err) {
        if (err) { throw err; }

        // обновить кол-во меда и горшочков у пчел
        con.query("UPDATE Bees SET potsCount=potsCount-" + countPots + ", honeyInPot=honeyInPot-(" + Number((countPots * 0.25).toFixed(5)) + ") WHERE id=1", function (error, result, fields) {
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
                var comission = +(((countPots * 0.25) * (user.promotion.percent / 100)).toFixed(5));

                // вставить в базу обновленные данные о балансе пользователя
                con.query("UPDATE User SET productAmount=" + user.productAmount + ", honeyAmount=" + user.honeyAmount + " WHERE login=" + mysql.escape(user.login), function (error, result, fields) {
                    if (error) {
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
                        con.query("UPDATE Promotion SET operationsCount=" + user.promotion.operationsCount + ", operationsToNext=" + user.promotion.operationsToNext + ", percent=" + user.promotion.percent + " WHERE idPromotion=" + user.promotion.id, function (error, result, fields) {
                            if (error) {
                                console.log(error.message);
                                con.commit(function (error) {
                                    callback(null, null);
                                    if (error) return con.rollback(function () { console.error(error.message); });
                                });
                                return con.rollback(function () { console.error(error.message); });
                            } else {
                                callback(user, comission);
                                con.commit(function (error) {
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
module.exports.getInformationForBuying = getInformationForBuying;
module.exports.buyHoney = buyHoney;
module.exports.updatePassword = updatePassword;
module.exports.deactivateAccount = deactivateAccount;

