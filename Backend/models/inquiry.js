'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inquiry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Inquiry.belongsTo(models.Product, { foreignKey: 'productId', as: 'product'});
      Inquiry.belongsTo(models.User, { foreignKey: 'buyerId', as: 'buyer' });
    }
  }
  Inquiry.init({
    message: DataTypes.STRING,
    productId: DataTypes.INTEGER,
    buyerId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('pending', 'resolved')
    }
  }, 
  {
    sequelize,
    modelName: 'Inquiry',
  });
  return Inquiry;
};