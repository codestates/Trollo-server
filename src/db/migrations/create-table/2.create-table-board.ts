import { Boards } from '../../models/board'; //방금 만들어준 user model

console.log('======Create Board Table======');

const create_table_board = async () => {
	await Boards.sync({ force: true })
		.then(() => {
			console.log('✅Success Create Board Table');
		})
		.catch(err => {
			console.log('❗️Error in Create Board Table : ', err);
		});
};

create_table_board();

// 'use strict';
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('boards', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       title: {
//         allowNull: false,
//         type: Sequelize.STRING
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     });
//   },
//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.dropTable('boards');
//   }
// };
