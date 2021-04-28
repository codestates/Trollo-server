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
	title: string;
}

export class Boards extends Model<BoardAttributes> {
	public title!: string;
	static associations: {
		boardBelongsToUser: Association<Boards, Users>;
		// define association here
	};
}
Boards.init(
	{
		title: DataTypes.STRING,
	},
	{
		sequelize,
		modelName: 'board',
	},
);

Boards.belongsTo(Users, {
	foreignKey: 'writer',
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
