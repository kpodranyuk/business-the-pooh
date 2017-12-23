var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../db/admindb.js');
var editData = require('../model/datapromotionandpots');
var common = require('../model/common');

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
 * Отредактировать тип товара
 */
router.post('/edit-product', function (req, res) {
    // Получаем id типа товара
    var idProduct = req.body.idProduct;
    // Новое имя типа товара
    var newProductName = req.body.newName;
    // Новый курс товара нового типа
    var newExchangeRate = req.body.rate;

    db.editProduct(idProduct, newProductName, newExchangeRate, function (result) {
        if (result == null) {
            res.json({ success: false, message: 'Не удалось редактировать тип товара' });
        }
        else if (result == false) {
            res.json({ success: false, message: 'Тип товара с таким названием уже существует' });
        }
        else {
            req.io.sockets.emit('update-type-product', { type: common.getStringProductType(idProduct)});
            res.json({
                success: true
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
            req.io.sockets.emit('update-type', { oldUserType: userType});
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
    var count = Number(req.body.pots);
    editData.setNewPots(count);
    res.json({
        success: true
    });
});


/**
 * Редактирование комисии для новых пользователей
 */
router.post('/edit-commission', function (req, res) {
    var comission = [Number(req.body.startDInput), Number(req.body.secondDInput), Number(req.body.thirdDInput)];
    editData.setNewСommission(comission);
    res.json({
        success: true
    });
});


/**
 * Получение информации о кол-во выпускаемых горшочков
 */
router.post('/pots-count-info', function (req, res) {
    
    var count = editData.getPots();
    res.json({
        success: true,
        pots: count
    });
});


/**
 * Получение информации о комиссии
 */
router.post('/commission-info', function (req, res) {

    var comission = editData.getCommission();
    res.json({
        success: true,
        comission: comission
    });
});


module.exports = router;