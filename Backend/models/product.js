'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Farm, { foreignKey: 'farmId', as: 'farm' });
      Product.hasMany(models.Inquiry, { foreignKey: 'productId', as: 'inquiries' });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    farmId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('available', 'sold out', 'preOrder'),
      defaultValue: 'available'
    }
  }, 
  {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};

