'use strict';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';
import { Users } from './user';
import { Tasks } from './task';

export interface WorkspaceAttributes {
	title: string;
	color: string;
	user_id: number;
	index: number;
}

export class Workspaces extends Model<WorkspaceAttributes> {
	public title!: string;
	public user_id!: number;
	public index!: number;
	public color!: string;
}

Workspaces.init(
	{
		title: DataTypes.STRING,
		color: DataTypes.STRING,
		user_id: DataTypes.INTEGER,
		index: DataTypes.INTEGER,
	},
	{
		sequelize,
		modelName: 'workspace',
	},
);

Workspaces.belongsTo(Users, {
	foreignKey: 'user_id',
	targetKey: 'id',
});
