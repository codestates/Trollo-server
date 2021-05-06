'use strict';
import { DataTypes, Model, Association } from 'sequelize';
import { sequelize } from './index';
import { Boards } from './board';
import { Workspaces } from './workspace';

interface UserAttributes {
	email: string;
}

export class Users extends Model<UserAttributes> {
	public email!: string;
	static associations: {
		userHasManyBoard: Association<Users, Boards>;
		userHasManyTaskList: Association<Users, Workspaces>;
	};
}

Users.init(
	{
		email: DataTypes.STRING,
	},
	{
		sequelize,
		modelName: 'user',
	},
);
