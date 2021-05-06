'use strict';
import { DataTypes, Model, Association } from 'sequelize';
import { sequelize } from './index';
import { Workspaces } from './workspace';

export interface TaskAttributes {
	title: string;
	checklist?: string;
	start_date: string;
	end_date: string;
	tasklist_id: number;
	index: number;
	desc: string;
	user_id: number;
}

export class Tasks extends Model<TaskAttributes> {
	public title!: string;
	public checklist!: string;
	public start_date!: string;
	public end_date!: string;
	public tasklist_id!: number;
	public index!: number;
	public desc!: string;
	public user_id!: number;
	static associations: {
		boardBelongsToUser: Association<Tasks, Workspaces>;
	};
}

Tasks.init(
	{
		title: DataTypes.STRING,
		checklist: DataTypes.STRING,
		start_date: DataTypes.STRING,
		end_date: DataTypes.STRING,
		tasklist_id: DataTypes.INTEGER,
		index: DataTypes.INTEGER,
		desc: DataTypes.STRING,
		user_id: DataTypes.INTEGER,
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
