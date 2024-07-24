'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Users',
        'roles',
        {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: false,
          defaultValue: []
        }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'roles');
  }
};