'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Churches', 'distanceToMotherTemple', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Churches', 'pastor', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Churches', 'landlinePhone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Churches', 'mobilePhone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Churches', 'capacity', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Churches', 'sectorNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Churches', 'distanceToMotherTemple');
    await queryInterface.removeColumn('Churches', 'pastor');
    await queryInterface.removeColumn('Churches', 'landlinePhone');
    await queryInterface.removeColumn('Churches', 'mobilePhone');
    await queryInterface.removeColumn('Churches', 'capacity');
    await queryInterface.removeColumn('Churches', 'sectorNumber');
  },
};
