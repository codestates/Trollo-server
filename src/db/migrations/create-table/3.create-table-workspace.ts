import { Workspaces } from '../../models/workspace'; //방금 만들어준 user model

console.log('======Create Workspace Table======');

const create_table_workspaces = async () => {
	await Workspaces.sync({ force: true })
		.then(() => {
			console.log('✅Success Create workspace Table');
		})
		.catch(err => {
			console.log('❗️Error in Create workspace Table : ', err);
		});
};

create_table_workspaces();

// 'use strict';
// module.exports = {
// 	up: async (queryInterface, Sequelize) => {
// 		await queryInterface.createTable('workspaces', {
// 			id: {
// 				allowNull: false,
// 				autoIncrement: true,
// 				primaryKey: true,
// 				type: Sequelize.INTEGER,
// 			},
// 			title: {
// 				allowNull: false,
// 				type: Sequelize.STRING,
// 			},
// 			createdAt: {
// 				allowNull: false,
// 				type: Sequelize.DATE,
// 			},
// 			updatedAt: {
// 				allowNull: false,
// 				type: Sequelize.DATE,
// 			},
// 		});
// 	},
// 	down: async (queryInterface, Sequelize) => {
// 		await queryInterface.dropTable('workspaces');
// 	},
// };
