'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SectorMerriageRecords', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      sectorChurchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: 'SectorChurches' },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
      deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('SectorMerriageRecords', ['sectorChurchId'], {
      name: 'idx_sector_merriage_church',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('SectorMerriageRecords');
  }
};
