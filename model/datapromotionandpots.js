var fs = require('fs');
var path = "model/data.json";
var data = {
    pots: 0,
    commission: [
        0,
        0,
        0
    ]
};


// загрузить данные из файла
var obj = fs.readFileSync(path);
obj = JSON.parse(obj);
data.pots = obj.pots;
data.commission[0] = obj.commission[0];
data.commission[1] = obj.commission[1];
data.commission[2] = obj.commission[2];

/**
 * Установить новое значение кол-ва выпускаемых горшочков за сутки
 * @param {number} count 
 */
function setNewPots(count) {
    data.pots = count;
    writeDataInFile();
}

/**
 * Получить кол-во выпускаемых горшочков в сутки
 * @return кол-во горшочков
 */
function getPots() {
    return data.pots;
}

/**
 * Установить новую комиссию
 * @param {mass} commission 
 */
function setNewСommission(commission) {
    data.commission = commission;
    writeDataInFile();
}

/**
 * Получить комиссию
 * @return список комиссии
 */
function getCommission() {
    return data.commission;
}

/**
 * Записать данные в файл
 */
function writeDataInFile() {
    fs.writeFileSync(path, JSON.stringify(data));
}

module.exports.setNewPots = setNewPots;
module.exports.getPots = getPots;
module.exports.getCommission = getCommission;
module.exports.setNewСommission = setNewСommission;