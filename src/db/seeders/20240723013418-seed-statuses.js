'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Statuses', [
      {
        id: 1,
        name: 'Activo',
        description: 'Miembro activo',
        createdAt: new Date('2024-06-13T21:20:25.323Z'),
        updatedAt: new Date('2024-06-13T21:20:25.323Z'),
      },
      {
        id: 2,
        name: 'Inactivo',
        description: 'Miembro inactivo',
        createdAt: new Date('2024-06-13T21:20:25.525Z'),
        updatedAt: new Date('2024-06-13T21:20:25.525Z'),
      },
      {
        id: 10,
        name: 'Fallecido',
        description: 'Miembro fallecido',
        createdAt: new Date('2024-07-13T17:45:43.184Z'),
        updatedAt: new Date('2024-07-13T17:45:43.184Z'),
      },
      {
        id: 11,
        name: 'Trasladado',
        description: 'Miembro se trasladó a otra iglesia o misión',
        createdAt: new Date('2024-07-13T17:45:43.294Z'),
        updatedAt: new Date('2024-07-13T17:45:43.294Z'),
      },
      {
        id: 12,
        name: 'Expulsado',
        description: 'Miembro expulsado de la iglesia',
        createdAt: new Date('2024-07-13T17:45:43.392Z'),
        updatedAt: new Date('2024-07-13T17:45:43.392Z'),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Sstatuses', null, {});
  }
};
