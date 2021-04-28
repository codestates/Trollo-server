'use strict';
import {
	Sequelize,
	DataTypes,
	Model,
	Optional,
	HasManyGetAssociationsMixin,
	HasManyAddAssociationMixin,
	HasManyHasAssociationMixin,
	HasManyCountAssociationsMixin,
	HasManyCreateAssociationMixin,
	Association,
} from 'sequelize';
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
		// define association here
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

// Users.hasMany(Boards, {
// 	foreignKey: 'user_id',
// 	sourceKey: 'id',
// });
// Users.hasMany(Workspaces, {
// 	foreignKey: 'user_id',
// 	sourceKey: 'id',
// });
