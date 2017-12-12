var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../db/admindb.js');

/**
 * Получение информации о текущем курсе товаров
 */
router.post('/exchange-rate-info', function (req, res) {

    db.getExchangeRateInfo(function (result) {
        if (result == null) {
            res.json({ success: false, message: 'Не удалось получить информацию о текущем курсе товаров' });
        }
        else {
            res.json({
                success: true,
                products: result
            });
        }
    });

});


/**
 * Отредактировать товар
 */
router.post('/edit-product', function (req, res) {
    // Получаем id товара
    var idProduct = req.body.idProduct;
    // Новое имя товара
    var newProductName = req.body.newName;
    // Новый курс товара
    var newExchangeRate = req.body.rate;
    // Если необходимо изменить имя товара
    if (newProductName != null) {
        db.editProductName(idProduct, newProductName, function (result) {
            if (result == true) {
                res.json({ success: false, message: 'Не удалось изменить имя товара' });
            }
        });
    }
    // Если необходимо изменить курс товара
    if (newExchangeRate != null) {
        db.editProductRate(idProduct, newExchangeRate, function (result) {
            if (result != true) {
                res.json({ success: false, message: 'Не удалось изменить курс товара' });
            }
        });
    }
    // Получение баланса
    db.getExchangeRateInfo(function (result) {
        if (result == null) {
            res.json({ success: false, message: 'Не удалось получить информацию о текущем курсе товаров' });
        }
        else {
            res.json({
                success: true,
                products: result
            });
        }
    });

});


/**
 * Получить информацию о всех типах пользователей
 */
router.post('/user-type-info', function (req, res) {
    db.getUserTypesInfo(function (result) {
        if (result == null) {
            res.json({ success: false, message: 'Не удалось получить информацию о типах пользователей' });
        }
        else {
            res.json({
                success: true,
                userTypes: result
            });
        }
    });
});


/**
 * Отредактировать определенный тип пользователя
 */
router.post('/user-type-edit', function (req, res) {
    // Имя типа для редактирования
    var userType = req.body.userType;
    // Новое имя
    var newUserType = req.body.newUserType;
    // Новый тип
    var idProduct = req.body.idProduct;


    db.editUserType(userType, newUserType, idProduct, function (result) {
        if (result == null) {
            res.json({ success: false, message: 'Не удалось редактировать тип пользователя' });
        }
        if (result == false) {
            res.json({ success: false, message: 'Тип с таким названием уже существует' });
        }
        else {
            res.json({
                success: true
            });
        }
    });

});


/**
 * Удалить определенный тип пользователя
 */
router.post('/user-type-delete', function (req, res) {

    // Имя типа для удаления
    var userType = req.body.userType;
    db.deleteUserType(userType, function (result) {
        if (result == null) {
            res.json({ success: false, message: 'Не удалось удалить тип пользователя' });
        }
        else {
            res.json({
                success: true
            });
        }
    });
});


/**
 * Добавить определенный тип пользователя
 */
router.post('/user-type-add', function (req, res) {

    // Имя типа для добавления
    var userType = req.body.userType;
    // Тип товара
    var idProduct = req.body.idProduct;

    db.addUserType(userType, idProduct, function (result) {
        if (result == null) {
            res.json({ success: false, message: 'Не удалось добавить тип пользователя' });
        }
        if (result == false) {
            res.json({ success: false, message: 'Тип с таким названием уже существует' });
        }
        else {
            res.json({
                success: true
            });
        }
    });
});


/**
 * Редактирование кол-ва выпускаемого пчелами меда в сутки
 */
router.post('/edit-pots-count', function (req, res) {

});


/**
 * Редактирование системы поощерения для новых пользователей
 */
router.post('/edit-promotion', function (req, res) {

});


module.exports = router;