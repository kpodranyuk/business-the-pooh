var fs = require('fs');
var path = "./data.json";
var data = {
    pots: 0,
    promotions: [
        0,
        0,
        0
    ]
};


// загрузить данные из файла
var obj = fs.readFileSync(path);
obj = JSON.parse(obj);
data.pots = obj.pots;
data.promotions[0] = obj.promotions[0];
data.promotions[1] = obj.promotions[1];
data.promotions[2] = obj.promotions[2];

