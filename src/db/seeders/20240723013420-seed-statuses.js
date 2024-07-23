'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Statuses', [
      {
        id: 3,
        name: 'Activo',
        description: 'Miembro activo',
        createdAt: new Date('2024-06-13T21:20:25.323Z'),
        updatedAt: new Date('2024-06-13T21:20:25.323Z'),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Sstatuses', null, {});
  }
};
