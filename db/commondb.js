var mysql = require('mysql');
var config = require('./config');
var OperationDay = require('../model/operationday.js');
var Operation = require('../model/operation');
var userdb = require("./userdb");

var con = mysql.createConnection({
    host: config["host"],
    port: config["port"],
    user: config["user"],
    password: config["password"],
    database: config["database"]
});

con.connect(function (error) {
    if (error) {
        console.log("Не удалось подключиться к БД");
    } else {
        console.log("Удалось подключиться к БД");
    }
});

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
        var sql = "SELECT o.idOperation, o.type, o.date, o.productAmount, "
            + "o.honeyCount, o.honeyPots, o.idProductType,o.comission "
            + "FROM operation o LEFT OUTER JOIN deal d "
            + "ON o.idOperation = d.idOperation where loginUser = " + mysql.escape(loginUser)
            + " AND o.date BETWEEN " + mysql.escape(opDay.startDay.toLocaleString()) + " AND " + mysql.escape(opDay.endDay.toLocaleString());
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
        var sql = "UPDATE user SET honeyAmount = honeyAmount-" + honey
        " WHERE login = " + mysql.escape(login);
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
        var sql = "SELECT u.productAmount, u.honeyAmount, u.idProductType "
            + "FROM user u "
            + "WHERE login = " + mysql.escape(login);
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
        var values = [[operation.type, operation.datatime, operation.productAmount, operation.honeyPots, operation.honeyCount, operation.comission, userdb.getIndexProductType(operation.productType)]];
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


module.exports.getUserBalance = getUserBalance;
module.exports.withdrawUserHoney = withdrawUserHoney;
module.exports.getTodaysOperations = getTodaysOperations;
module.exports.getAllHistory = getAllHistory;
module.exports.insertNewOperation = insertNewOperation;