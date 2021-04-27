'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // fk 추가하기
    await queryInterface.addColumn('boards', 'writer', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users', 
        key: 'id'
      }
    });
    await queryInterface.addColumn('tasks', 'tasklisk_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'workspaces', 
        key: 'id'
      }
    });
    await queryInterface.addColumn('workspaces', 'user_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users', 
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
