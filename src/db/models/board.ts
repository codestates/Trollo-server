'use strict';
import { DataTypes, Model, Association } from 'sequelize';
import { sequelize } from './index';
import { Users } from './user';

interface BoardAttributes {
	id: number | undefined;
	writer: string | undefined;
	title: string;
	user_id: number | undefined;
}

export class Boards extends Model<BoardAttributes> {
	public readonly id!: number;
	public writer!: string;
	public title!: string;
	static associations: {
		boardBelongsToUser: Association<Boards, Users>;
	};
}

Boards.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		writer: DataTypes.STRING,
		title: DataTypes.STRING,
		user_id: DataTypes.INTEGER,
	},
	{
		sequelize,
		modelName: 'board',
	},
);

Boards.belongsTo(Users, {
	foreignKey: 'user_id',
	targetKey: 'id',
});
