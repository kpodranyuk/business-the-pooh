var mysql = require('mysql');
var OperationDay = require('../model/operationday.js');
var Operation = require('../model/operation');
var common = require("../model/common");
var con = require("./connection");
var User = require('../model/usermodel');
var UserType = require('../model/usertype');
var ProductType = require('../model/producttype');
var Promotion = require('../model/promotion');


/**
 * Получить историю операций
 * @param {string} loginUser - логин пользователя
 * @param {function} функция, отправляющая историю операций пользователя
 */
function getAllHistory(loginUser, callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (error) {
        if (error) { throw error; }
        var sql = "SELECT o.idOperation, o.type, o.date, o.productAmount, "
            + "o.honeyCount, o.honeyPots, o.idProductType,o.comission "
            + "FROM operation o LEFT OUTER JOIN deal d "
            + "ON o.idOperation = d.idOperation where loginUser = " + mysql.escape(loginUser);

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
 * Получить операции прошедшие в текущий день
 * @param {string} loginUser - логин пользователя
 * @param {function} функция, отправляющая список операций
 */
function getTodaysOperations(loginUser, callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (error) {
        if (error) { throw error; }
        // Опеределить временные рамки текущего операционного дня с помощью класса OperationDay
        var opDay = new OperationDay(new Date());
        // Сделать выборку из БД всех операций за текущий день
        var sql = "SELECT o.idOperation, o.type as type, o.date as date, o.productAmount, "
            + "o.honeyCount as honeyCount, o.honeyPots, o.idProductType,o.comission as comission "
            + "FROM operation o LEFT OUTER JOIN deal d "
            + "ON o.idOperation = d.idOperation where d.loginUser = " + mysql.escape(loginUser)
            + " AND o.date BETWEEN " + mysql.escape(opDay.getLastOperationDay().startDay.toLocaleString()) + " AND " + mysql.escape(opDay.endDay.toLocaleString());
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
 * Снять мед с счета пользователя
 * @param {string} login - логин пользователя
 * @param {double} honey - количество мёда для снятия
 * @param {function} функция, отправляющая полученный баланс
 */
function withdrawUserHoney(login, honey, callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (error) {
        if (error) { throw error; }
        // Обновить поле с количеством меда пользователя
        var sql = "UPDATE user SET honeyAmount = honeyAmount-" + Number((honey).toFixed(5))
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
 * Получить баланс пользователя
 * @param {string} login - логин пользователя
 * @param {function} функция, отправляющая полученный баланс
 */
function getUserBalance(login, callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (error) {
        if (error) { throw error; }
        // Сделать выборку из БД информации о счете пользователя
        var sql = "SELECT u.productAmount, u.honeyAmount as honeyAmount, u.idProductType "
            + "FROM user u "
            + "WHERE u.login = " + mysql.escape(login);
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
 * Вставить новую операцию
 * @param {Operation} operation - операция
 * @param {string} login - логин пользователя
 * @param {function} функция, отправляющая успешность вставки операции
 */
function insertNewOperation(operation, login, callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (err) {
        if (err) { throw err; }

        // Вставляем новую операцию
        var values = [[operation.type, operation.datatime, operation.productAmount, operation.honeyPots, operation.honeyCount, operation.comission, common.getIndexProductType(operation.productType)]];
        con.query("INSERT INTO Operation(type, date, productAmount, honeyPots, honeyCount, comission, idProductType) VALUES " + mysql.escape(values), function (error, result, fields) {
            if (error) {
                con.commit(function (error) {
                    callback(false);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
            } else {
                var id = result.insertId;
                values = [[login, id]];
                con.query("INSERT INTO Deal(loginUser, idOperation) VALUES " + mysql.escape(values), function (error, result, fields) {
                    if (error) {
                        con.commit(function (error) {
                            callback(false);
                            if (error) return con.rollback(function () { console.error(error.message); });
                        });
                    } else {
                        con.commit(function (error) {
                            if (error) return con.rollback(function () { console.error(error.message); });
                            callback(true);
                        });
                    }
                });
            }
        });
    });
}


/**
 * 
 * @param {function} callback - функция, возвращающая успешность 
 */
function generateNewPots(callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (err) {
        if (err) { throw err; }

        con.query("UPDATE Bees SET potsCount=FLOOR((honeyInPot+12.5)/0.25), honeyInPot=honeyInPot+12.5 WHERE id=1", function (error, result, fields) {
            if (error) {
                callback(false);
                return con.rollback(function () { console.error(error.message); });
            } else {
                con.commit(function (error) {
                    if (error) return con.rollback(function () { console.error(error.message); });
                    callback(true);
                });
            }
        });
    });
}


/**
 * Получить пользователя
 * @param {string} login - логин пользователя
 * @param {function} callback - функция, возвращающая пользователя
 */
function getUser(login, callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (err) {
        if (err) { throw err; }

        // Получаем самого юзера
        con.query("SELECT * FROM User where login=" + mysql.escape(login), function (error, result) {
            if (error) {
                callback(null);
                return con.rollback(function () { console.error(error.message); });
            } else {

                var user = new User(login, result[0].name);
                user.password = result[0].password;
                user.honeyAmount = result[0].honeyAmount;
                user.productAmount = result[0].productAmount;
                user.isAdmin = result[0].isAdmin;
                user.isDeactivation = result[0].isDeactivation;

                // Его скидку
                con.query("SELECT * FROM Promotion where idPromotion=" + mysql.escape(result[0].idPromotion), function (error, resP) {
                    if (error) {
                        callback(null);
                        return con.rollback(function () { console.error(error.message); });
                    } else {
                        var promotion = new Promotion(resP[0].idPromotion);
                        promotion.operationsToNext = resP[0].operationsToNext;
                        promotion.percent = resP[0].percent;
                        promotion.operationsCount = resP[0].operationsCount;
                        user.promotion = promotion;

                        // Тип пользователя и его тип продукта
                        var sql ="SELECT * FROM UserType u LEFT JOIN ProductType p ON"
                            +" u.productType = p.idProductType where u.name =" + mysql.escape(result[0].nameUserType);
                        con.query(sql, function(error, res) {
                            if (error) {
                                callback(null);
                                return con.rollback(function () { console.error(error.message); });
                            } else {
                                var productType = new ProductType(res[0].type, res[0].name, res[0].rate)
                                var userType = new UserType(result[0].nameUserType, res[0].isDeleted, productType);
                                user.userType = userType;

                                con.commit(function (error) {
                                    if (error) return con.rollback(function () { console.error(error.message); });
                                    callback(user);
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}

module.exports.getUserBalance = getUserBalance;
module.exports.withdrawUserHoney = withdrawUserHoney;
module.exports.getTodaysOperations = getTodaysOperations;
module.exports.getAllHistory = getAllHistory;
module.exports.insertNewOperation = insertNewOperation;
module.exports.generateNewPots = generateNewPots;
module.exports.getUser = getUser;