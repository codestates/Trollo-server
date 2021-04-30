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
} from 'sequelize';
import { sequelize } from './index';
import { Workspaces } from './workspace';

interface TaskAttributes {
	title: string;
	checklist: string;
	start_date: Date;
	end_date: Date;
	tasklist_id: number;
	index: number;
}

export class Tasks extends Model<TaskAttributes> {
	public title!: string;
	public checklist!: string;
	public start_date!: Date;
	public end_date!: Date;
	public tasklist_id!: number;
	public index!: number;
	static associations: {
		boardBelongsToUser: Association<Tasks, Workspaces>;
		// define association here
	};
}
Tasks.init(
	{
		title: DataTypes.STRING,
		checklist: DataTypes.STRING,
		start_date: DataTypes.DATE,
		end_date: DataTypes.DATE,
		tasklist_id: DataTypes.INTEGER,
		index: DataTypes.INTEGER,
	},
	{
		sequelize,
		modelName: 'task',
	},
);

Tasks.belongsTo(Workspaces, {
	foreignKey: 'tasklist_id',
	targetKey: 'id',
});

// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class task extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       task.belongsTo(models.workspace, {
//         foreignKey: 'tasklist_id',
//         targetKey: 'id'
//       });
//     }
//   };
//   task.init({
//     title: DataTypes.STRING,
//     checklist: DataTypes.STRING,
//     start_date: DataTypes.DATE,
//     end_date: DataTypes.DATE
//   }, {
//     sequelize,
//     modelName: 'task',
//   B});
//   ren task;
// };
