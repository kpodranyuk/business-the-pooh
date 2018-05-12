var db = require('../models/model.js');
const Sequelize = require('sequelize');

/**
 * Функция отправки данных на клиент
 * @param {*} res объект ответа на клиент
 * @param {JSON} content js объект который идет на клиент
 */
var sendJSONresponse = function (res, content) {
    res.json(content);
};

/**
 * Функция получения рейтинга за неделю
 */
module.exports.rating = function (req, res) {
    var msInDay = 86400000;  // миллисекунд в сутках
    var currentDate = new Date;  // текущая дата
    var prevWeekDate = new Date(currentDate - (7 * msInDay)); // дата на прошлой неделе
    db.Operation.findAll({
        where: {
            typeOperation: 'exchangeForestProductForHoney',
            date: {
                [db.op.gte]: prevWeekDate.getWeekStartDate(),
                [db.op.lte]: prevWeekDate.getWeekEndDate()
            }
        },
        attributes: ['loginUser', [db.fn('sum', db.col('countOutputProduct')), 'honey_sum']],
        group: ['loginUser'],
        limit: 10
    }).then(operations => {
        var operations = JSON.parse(JSON.stringify(operations));
        if (operations != null) {
            var loginUsers =Array ();
            for(var i = 0; i<operations.length;i++ ){
                loginUsers.push(operations[i].loginUser);
            }
            db.Operation.findAll({
                where: {
                    typeOperation: 'exchangeForestProductForHoney',
                    loginUser: { [db.op.or]: loginUsers}
                },
                attributes: ['loginUser', [db.fn('sum', db.col('countOutputProduct')), 'honey_sum_all']],
                group: ['loginUser']
            }).then(honey => {
                var honey = JSON.parse(JSON.stringify(honey));
                if (honey != null) {
                    var topOfAll =Array ();
                    for(var i = 0; i<operations.length;i++ ){
                        topOfAll.push({login: operations[i].loginUser,
                                      honeyOfWeek:  operations[i].honey_sum,
                                      honeyOfAllTime: honey[i].honey_sum_all
                                    });
                    }
                    sendJSONresponse(res, { ok: true, top:topOfAll});
                } else {
                    sendJSONresponse(res, { ok: false, message: "Не возможно получить мёд за всё время" });
                }
            });
        } else {
            sendJSONresponse(res, { ok: false, message: "Не возможно получить операции за прошлую неделю" });
        }
    }).catch(error => {
        console.log(error);
    });
};

// Returns the ISO day of week
Date.prototype.getWeekDay = function () {
    var day = this.getDay();
    if (day == 0) return 7;
    else return day;
}

// Returns current week start date
Date.prototype.getWeekStartDate = function () {
    var date = new Date(this.getTime());
    date.setDate(this.getDate() - (this.getWeekDay() - 1));
    return date;
}

// Returns current week end date
Date.prototype.getWeekEndDate = function () {
    var date = new Date(this.getTime());
    date.setDate(this.getDate() + (7 - this.getWeekDay()));
    return date;
}

