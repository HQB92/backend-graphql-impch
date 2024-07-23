'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: 2,
        rut: '18.450.907-5',
        username: 'germain',
        password: '$2a$10$wTaLYP.fOl6GSzX392DAseC/kA1ap63Xizn7JtJ33xezc2NBR2FUO',
        email: 'a@a.cl',
        createdAt: new Date('2024-06-15T16:05:14.774Z'),
        updatedAt: new Date('2024-06-15T16:05:14.774Z'),
      },
      {
        id: 4,
        rut: '18.773.106-2',
        username: 'camila',
        password: '$2a$10$wTaLYP.fOl6GSzX392DAseC/kA1ap63Xizn7JtJ33xezc2NBR2FUO',
        email: 'a@a.cl',
        createdAt: new Date('2024-06-21T13:00:52.681Z'),
        updatedAt: new Date('2024-06-21T13:00:52.681Z'),
      },
      {
        id: 1,
        rut: '18.156.271-4',
        username: 'hugo',
        password: '$2a$10$vacyWPH/L89H2GueyRnL/OyNwdqMdf0TGkPFywaIKM/pqX39QOd6m',
        email: 'hquinteros@ing.ucs.cl',
        createdAt: new Date('2024-06-15T15:45:52.681Z'),
        updatedAt: new Date('2024-06-21T20:18:39.360Z'),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
