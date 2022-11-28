'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.belongsTo(models.User, {foreignKey: 'organizerId', as: 'Organizer'})
      Group.belongsToMany(models.User, {
        through: 'Membership',
        foreignKey: 'groupId',
        otherKey: 'userId'
      })
      Group.hasMany(models.Venue, {foreignKey: 'groupId', onDelete: 'SET NULL', hooks: true})
      Group.hasMany(models.Event, {foreignKey: 'groupId', onDelete: 'cascade', hooks: true})
      Group.hasMany(models.GroupImage, {foreignKey: 'groupId', onDelete: 'cascade', hooks: true})
      Group.hasMany(models.Membership, {foreignKey: 'groupId', onDelete: 'cascade', hooks: true})
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 60]
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [50]
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['Online', 'In person']],
          msg: "Type must be 'Online' or 'In person'"
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 2]
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
