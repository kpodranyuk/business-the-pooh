var mysql = require('mysql');
var con = require("./connection");

/**
 * Получить информацию о текущем курсе товаров
 * @param {function} функция, отправляющая информацию о курсе
 */
function getExchangeRateInfo(callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (error) {
        if (error) { throw error; }
        // Сделать выборку из БД информации о курсе товаров
        var sql = "Select idProductType,name,rate from producttype where name<>\"Мед\"";
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
 * Отредактировать название товара
 * @param {int} idProduct - id товара
 * @param {string} newProductName - новое название товара
 * @param {function} функция, отправляющая результат редактирования
 */
function editProductName(idProduct, newProductName, callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (error) {
        if (error) { throw error; }
        // Обновить имя товара
        var sql = "UPDATE producttype SET name = " + mysql.escape(newProductName) + " where idProductType = " + mysql.escape(idProduct) + " and name<>\"Мед\"";
        con.query(sql, function (error, result, fields) {
            if (error) {
                console.log(error.message);
                con.commit(function (error) {
                    callback(null);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
                callback(true);
                return con.rollback(function () { console.error(error.message); });

            }
        });


    });

}
/**
 * Отредактировать курс товара
 * @param {int} idProduct - id товара
 * @param {int} newExchangeRate - новый курс обмена
 * @param {function} функция, отправляющая результат редактирования
 */
function editProductRate(idProduct, newExchangeRate, callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (error) {
        if (error) { throw error; }
        // Обновить курс товара
        var sql = "UPDATE producttype SET rate = " + mysql.escape(newExchangeRate) + " where idProductType = " + mysql.escape(idProduct) + " and name<>\"Мед\"";
        con.query(sql, function (error, result, fields) {
            if (error) {
                console.log(error.message);
                con.commit(function (error) {
                    callback(null);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
                callback(true);
                return con.rollback(function () { console.error(error.message); });
            }
        })
    });
}


/**
 * Получить информацию о всех типах пользователей
 * @param {function} функция, отправляющая информацию о всех типах пользователей
 */
function getUserTypesInfo(callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (error) {
        if (error) { throw error; }
        // Сделать выборку из БД информации о всех типах пользователей
        var sql = "Select * from usertype where name<>\"Винни-Пух\"";
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
 * Удалить определенный тип пользователя
 * @param {string} userType  тип пользователя который следует удалить
 * @param {function} функция, отправляющая результат удаления пользователя
 */
function deleteUserType(userType, callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (error) {
        if (error) { throw error; }
        // Узнать используется ли этот тип
        var sql = "Select name from user where nameUserType = " + mysql.escape(userType);
        con.query(sql, function (error, result, fields) {
            if (error) {
                con.commit(function (error) {
                    callback(null);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
            } else {
                if (result.length != 0) {
                    // Поставить деактивацию
                    sql = "UPDATE usertype SET isDeleted = 1 where name = " + mysql.escape(userType);
                    con.query(sql, function (error, result, fields) {
                        if (error) {
                            con.commit(function (error) {
                                callback(null);
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
                }
                else {   // Удалить 
                    sql = "Delete from usertype where name = " + mysql.escape(userType);
                    con.query(sql, function (error, result, fields) {
                        if (error) {
                            con.commit(function (error) {
                                callback(null);
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
                }
            }
        });
    });

}
/**
 * Добавить определенный тип пользователя
 * @param {string} userType  тип пользователя который следует удалить
 * @param {int} idProduct  тип товара
 * @param {function} функция, отправляющая результат добавления пользователя
 */
function addUserType(userType, idProduct, callback) {
    // Начинаем транзакцию 
    con.beginTransaction(function (error) {
        if (error) { throw error; }
        // Узнать существует ли тип с таким же названием
        var sql = "Select name from usertype where name = " + mysql.escape(userType);
        con.query(sql, function (error, result, fields) {
            if (error) {
                con.commit(function (error) {
                    callback(null);
                    if (error) return con.rollback(function () { console.error(error.message); });
                });
            } else {
                if (result.length != 0) {
                    con.commit(function (error) {
                        callback(false);
                        if (error) return con.rollback(function () { console.error(error.message); });
                    });
                }
                else {
                    // Добавить
                    sql = "INSERT INTO usertype(name, isDeleted, productType) VALUES (" + mysql.escape(userType) + ", 0, " + mysql.escape(idProduct) + ")";
                    con.query(sql, function (error, result, fields) {
                        if (error) {
                            con.commit(function (error) {
                                callback(null);
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
                }
            }
        });
    });
}

module.exports.getExchangeRateInfo = getExchangeRateInfo;
module.exports.editProductName = editProductName;
module.exports.editProductRate = editProductRate;
module.exports.getUserTypesInfo = getUserTypesInfo;
module.exports.deleteUserType = deleteUserType;
module.exports.addUserType = addUserType;
