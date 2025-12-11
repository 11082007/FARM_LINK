'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Farm, { foreignKey: 'userId', as: 'farm' });
      User.hasMany(models.Inquiry, { foreignKey: 'buyerId', as: 'inquiries' });
      User.hasMany(models.Subscription, { foreignKey: 'buyer_user_id', as: 'subscriptions' });
      User.hasMany(models.Notification, { foreignKey: 'buyer_user_id', as: 'notifications' });
      User.hasMany(models.Ledger, { as: 'sentTransactions', foreignKey: 'fromUserId'});
      User.hasMany(models.Ledger, { as: 'receivedTransactions', foreignKey: 'toUserId'});
    }

    validPassword(password) {
      return bcrypt.compareSync(password, this.password_hash);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING, // optional, if you want a single "name" field
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      userType: {
        type: DataTypes.ENUM('farmer', 'buyer'),
        allowNull: false,
        defaultValue: 'buyer',
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password_hash) {
            const salt = await bcrypt.genSalt(10);
            user.password_hash = await bcrypt.hash(user.password_hash, salt);
          }
        },
      },
    }
  );

  return User;
};
