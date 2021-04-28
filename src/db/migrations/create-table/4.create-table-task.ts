import { Tasks } from '../../models/task'; //방금 만들어준 user model

console.log('======Create Task Table======');

const create_table_tasks = async () => {
	await Tasks.sync({ force: true })
		.then(() => {
			console.log('✅Success Create Task Table');
		})
		.catch(err => {
			console.log('❗️Error in Create Task Table : ', err);
		});
};

create_table_tasks();

// 'use strict';
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('tasks', {
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
//       checklist: {
//         type: Sequelize.STRING
//       },
//       start_date: {
//         type: Sequelize.DATE
//       },
//       end_date: {
//         type: Sequelize.DATE
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
//     await queryInterface.dropTable('tasks');
//   }
// };
