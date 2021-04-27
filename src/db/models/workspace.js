'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class workspace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      workspace.hasMany(models.task, {
        foreignKey: 'tasklist_id',
        sourceKey: 'id'
      });
      workspace.belongsTo(models.user, {
        foreignKey: 'user_id',
        targetKey: 'id'
      });
    }
  };
  workspace.init({
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'workspace',
  });
  return workspace;
};