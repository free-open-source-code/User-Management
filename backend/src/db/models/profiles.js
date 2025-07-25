const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const profiles = sequelize.define(
    'profiles',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

bio: {
        type: DataTypes.TEXT,

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  profiles.associate = (db) => {

    db.profiles.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.profiles.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return profiles;
};

