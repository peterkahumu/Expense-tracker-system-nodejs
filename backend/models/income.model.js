const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model');

const Income = sequelize.define('Income', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
}, {
    timestamps: true,
    tableName: 'Income',
});

// set up the associations

Income.belongsTo(User, {foreignKey: 'userId', as:'user'});
User.hasMany(Income, {foreignKey: 'userId', as: 'income'});

module.exports = Income;