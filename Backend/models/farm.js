'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Farm extends Model {
    static associate(models) {
      Farm.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Farm.hasMany(models.Product, { foreignKey: 'farmId', as: 'products' });
      Farm.hasMany(models.Subscription, { foreignKey: 'farm_id', as: 'subscriptions' });
      Farm.hasMany(models.Notification, { foreignKey: 'farm_id', as: 'notifications' });
    }
  }
  Farm.init(
    {
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER
    }
  }, 
  {
    sequelize,
    modelName: 'Farm',
  });
  return Farm;
};