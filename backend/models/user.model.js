const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')

const User = sequelize.define('User', {
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users',
})

module.exports = User