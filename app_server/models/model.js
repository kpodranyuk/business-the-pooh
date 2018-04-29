const Sequelize = require('sequelize');
var uri = "postgres://postgres:root@localhost:5432/business-the-pooh";

if (process.env.NODE_ENV == 'production') {
    uri = "postgres://xpthntlumjcczh:325bc3ff9438333b0c0749b0199deaa40ccb1dd2b382e83d32b868f72a3f2a52@ec2-54-75-239-237.eu-west-1.compute.amazonaws.com:5432/dd8cogpq2qlard";
}
const sequelize = new Sequelize(uri, {
    dialect: 'postgres',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false // true by default
    }
});

// Пользователь
const User = sequelize.define('users', {
    login: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    password: {
        type: Sequelize.STRING
    },
});

// Кошелек
const Purse = sequelize.define('purses', {
    amount: {
        type: Sequelize.DOUBLE
    },
    itemType: {
        type: Sequelize.ENUM('ruble', 'honey', 'flower', 'pot', 'balloon')
    }
});
Purse.removeAttribute('id');

// Операция
const Operation = sequelize.define('operations', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    typeOperation: {
        type: Sequelize.ENUM('entryMoney', 'exchangeForForestProduct', 'exchangeForestProductForHoney')
    },
    date: {
        type: Sequelize.DATE
    },
    countEntryProduct: {
        type: Sequelize.INTEGER
    },
    entryProduct: {
        type: Sequelize.ENUM('ruble', 'honey', 'flower', 'pot', 'balloon')
    },
    countOutputProduct: {
        type: Sequelize.INTEGER
    },
    outputProduct: {
        type: Sequelize.ENUM('ruble', 'honey', 'flower', 'pot', 'balloon')
    }
});

// Курс
const Course = sequelize.define('courses', {
    entryProduct: {
        type: Sequelize.ENUM('ruble', 'honey', 'flower', 'pot', 'balloon')
    },
    countOutputProduct: {
        type: Sequelize.DOUBLE
    },
    outputProduct: {
        type: Sequelize.ENUM('ruble', 'honey', 'flower', 'pot', 'balloon')
    }
});
Course.removeAttribute('id');

// Связываем таблицы
User.hasMany(Purse, { foreignKey: 'loginUser' });
User.hasMany(Operation, { foreignKey: 'loginUser' });


// Создаем таблицы в базе
sequelize.authenticate({ force: true })
    .then(() => {
        console.log("Удаление таблиц");
        return sequelize.drop({ force: true });
    }).then(() => {
        console.log("Создание таблиц");
        return sequelize.sync({ force: true });
    }).then(() => {
        console.log("Добавляем по умолчанию курс");
        return Course.bulkCreate([
            { entryProduct: 'ruble', countOutputProduct: 4, outputProduct: 'flower' },
            { entryProduct: 'ruble', countOutputProduct: 6, outputProduct: 'pot' },
            { entryProduct: 'ruble', countOutputProduct: 4.5, outputProduct: 'balloon' },
            { entryProduct: 'flower', countOutputProduct: 2, outputProduct: 'honey' },
            { entryProduct: 'pot', countOutputProduct: 1, outputProduct: 'honey' },
            { entryProduct: 'balloon', countOutputProduct: 0.75, outputProduct: 'honey' }
        ]);
    }).catch(error => {
        console.log(error);
    });

module.exports.op = sequelize.Op; // Операции для where
module.exports.User = User;
module.exports.Purse = Purse;
module.exports.Operation = Operation;
module.exports.Course = Course;