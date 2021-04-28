import { Users } from '../../models/user'; //방금 만들어준 user model

console.log('======Create User Table======');

const create_table_users = async () => {
	await Users.sync({ force: true })
		.then(() => {
			console.log('✅Success Create User Table');
		})
		.catch(err => {
			console.log('❗️Error in Create User Table : ', err);
		});
	return;
};

create_table_users();

// 'use strict';
// module.exports = {
// 	up: async (queryInterface, Sequelize) => {
// 		await queryInterface.createTable('users', {
// 			id: {
// 				allowNull: false,
// 				autoIncrement: true,
// 				primaryKey: true,
// 				type: Sequelize.INTEGER,
// 			},
// 			email: {
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
// 		await queryInterface.dropTable('users');
// 	},
// };
