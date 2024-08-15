const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("my_expenses", 'root', '1234' , {
    host: 'localhost',
    port: 3300, // default port for mysql is 3306
    dialect: 'mysql',
    dialectModule: require('mysql2'), // use mysql2 module.
    logging: false
});

module.exports = sequelize;