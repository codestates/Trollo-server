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
import { Users } from './user';
interface BoardAttributes {
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
		// define association here
	};
}
Boards.init(
	{
		writer: DataTypes.STRING,
		title: DataTypes.STRING,
		user_id: DataTypes.NUMBER,
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

// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class board extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       board.belongsTo(models.user, {
//         foreignKey: 'writer',
//         targetKey: 'id'
//       });
//     }
//   };
//   board.init({
//     title: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'board',
//   });
//   return board;
// };
