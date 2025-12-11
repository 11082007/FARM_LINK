'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ledger extends Model {
    
    static associate(models) {
     Ledger.belongsTo(models.User, { as: 'sender', foreignKey: 'fromUserId' });
     Ledger.belongsTo(models.User, { as: 'receiver', foreignKey: 'toUserId' });
    }
  }
  Ledger.init({
    transactionId: DataTypes.STRING,
    fromUserId: DataTypes.INTEGER,
    toUserId: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    status: DataTypes.STRING,
    prevHash: DataTypes.STRING,
    hash: DataTypes.STRING,
    description: DataTypes.TEXT,
    metadata: DataTypes.JSON,
    onChainTxHash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ledger',
  });
  return Ledger;
};

