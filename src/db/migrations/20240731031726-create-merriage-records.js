'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('merriageRecords', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      husbandId: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      fullNameHusband: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      wifeId: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      fullNameWife: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      civilCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      civilDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      civilPlace: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      religiousDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('merriageRecords');
  }
};
