'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      console.log('Starting to seed a single member...');
      await queryInterface.bulkInsert('Members', [
        {
          rut: '18.156.271-4',
          names: 'Hugo Esteban',
          lastNameDad: 'Quinteros',
          lastNameMom: 'Bustos',
          dateOfBirth: new Date('1992-08-06'),
          address: 'Central 320, Chillán',
          telephone: '',
          mobile: '997941598',
          email: 'hquinteros@ing.ucsc.cl',
          maritalStatus: 'Soltero(a)',
          probationStartDate: new Date('2016-11-23'),
          fullMembershipDate: new Date('2017-10-28'),
          churchId: 1,
          statusId: 1,
          userId: 1,
          sexo: 'Masculino',
          createdAt: new Date('2024-06-18T23:38:10.924Z'),
          updatedAt: new Date('2024-06-18T23:38:10.924Z'),
        },
      ], { transaction });
      await transaction.commit();
      console.log('Single member seeded successfully.');
    } catch (error) {
      await transaction.rollback();
      console.error('Error seeding single member:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('Members', { rut: '18.156.271-4' }, { transaction });
      await queryInterface.bulkDelete('SeedersData', { name: '20240723022626-seed-members.js' }, { transaction });
      await transaction.commit();
      console.log('Seeded single member rolled back successfully.');
    } catch (error) {
      await transaction.rollback();
      console.error('Error rolling back seeded single member:', error);
    }
  },
};
