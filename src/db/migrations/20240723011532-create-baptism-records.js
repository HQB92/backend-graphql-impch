'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BaptismRecords', {
      childRut: {
        type: Sequelize.STRING(12),
        allowNull: false,
        primaryKey: true,
      },
      childFullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      childDateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      fatherRut: {
        type: Sequelize.STRING(12),
        allowNull: true,
      },
      fatherFullName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      motherRut: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      motherFullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      placeOfRegistration: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      baptismDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      registrationNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      registrationDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BaptismRecords');
  },
};
