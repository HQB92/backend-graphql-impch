'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Churches', [
      {
        id: 1,
        name: 'Zañartu',
        address: 'Calle Ñuble 142',
        createdAt: new Date('2024-06-13T21:20:25.462Z'),
        updatedAt: new Date('2024-06-13T21:20:25.462Z'),
      },
      {
        id: 2,
        name: 'Oro Verde',
        address: 'camino a portezuelo',
        createdAt: new Date('2024-06-18T23:41:25.590Z'),
        updatedAt: new Date('2024-06-18T23:41:25.590Z'),
      },
      {
        id: 3,
        name: 'El Parron',
        address: 'camino a portezuelo',
        createdAt: new Date('2024-06-18T23:41:34.783Z'),
        updatedAt: new Date('2024-06-18T23:41:34.783Z'),
      },
      {
        id: 4,
        name: 'La Hermosa',
        address: 'camino a huape',
        createdAt: new Date('2024-06-18T23:43:08.617Z'),
        updatedAt: new Date('2024-06-18T23:43:08.617Z'),
      },
      {
        id: 5,
        name: 'Malloa Norte',
        address: 'camino a huape',
        createdAt: new Date('2024-06-18T23:43:16.523Z'),
        updatedAt: new Date('2024-06-18T23:43:16.523Z'),
      },
      {
        id: 6,
        name: 'Malloa Sur',
        address: 'camino a huape',
        createdAt: new Date('2024-06-18T23:43:33.429Z'),
        updatedAt: new Date('2024-06-18T23:43:33.429Z'),
      },
      {
        id: 7,
        name: 'Huape',
        address: 'camino a huape',
        createdAt: new Date('2024-06-18T23:43:50.791Z'),
        updatedAt: new Date('2024-06-18T23:43:50.791Z'),
      },
      {
        id: 8,
        name: 'Quinchamali',
        address: 'camino a huape',
        createdAt: new Date('2024-06-18T23:43:59.390Z'),
        updatedAt: new Date('2024-06-18T23:43:59.390Z'),
      },
      {
        id: 9,
        name: 'Confluencia',
        address: 'camino a huape',
        createdAt: new Date('2024-06-18T23:44:05.188Z'),
        updatedAt: new Date('2024-06-18T23:44:05.188Z'),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Churches', null, {});
  }
};
