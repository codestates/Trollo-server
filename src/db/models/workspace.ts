'use strict';
import {
	// Sequelize,
	DataTypes,
	Model,
	// Optional,
	// HasManyGetAssociationsMixin,
	// HasManyAddAssociationMixin,
	// HasManyHasAssociationMixin,
	// HasManyCountAssociationsMixin,
	// HasManyCreateAssociationMixin,
	Association,
	Sequelize,
} from 'sequelize';
import { sequelize } from './index';
import { Users } from './user';
import { Tasks } from './task';

interface WorkspaceAttributes {
	title: string;
	user_id: number;
}

export class Workspaces extends Model<WorkspaceAttributes> {
	public title!: string;
	public user_id!: number;
	static associations: {
		// WorkspaceBelongsToTask: Association<Workspaces, Tasks>;
		// define association here
	};
}
Workspaces.init(
	{
		title: DataTypes.STRING,
		user_id: DataTypes.INTEGER,
	},
	{
		sequelize,
		modelName: 'workspace',
	},
);

// Workspaces.hasMany(Tasks, {
// 	foreignKey: 'tasklist_id',
// 	sourceKey: 'id',
// });
Workspaces.belongsTo(Users, {
	foreignKey: 'user_id',
	targetKey: 'id',
});

// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class workspace extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       workspace.hasMany(models.task, {
//         foreignKey: 'tasklist_id',
//         sourceKey: 'id'
//       });
//       workspace.belongsTo(models.user, {
//         foreignKey: 'user_id',
//         targetKey: 'id'
//       });
//     }
//   };
//   workspace.init({
//     title: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'workspace',
//   });
//   return workspace;
// };
