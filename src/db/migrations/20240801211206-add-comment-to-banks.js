'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Banks', 'comment', {
      type: Sequelize.STRING,
      allowNull: true, // Permite valores nulos, puedes cambiar esto según tus necesidades
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Banks', 'comment');
  }
};
