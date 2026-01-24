'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BuildingDetails', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      inventoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: {
            tableName: 'Inventories',
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      propertyArea: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      builtArea: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      wallTypes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      floorTypes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ceilingTypes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      roofCovering: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      propertyEnclosure: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      numberOfDoors: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      numberOfWindows: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      electricalEnergy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      electricalEnergyOther: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      water: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      waterOther: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bathroomDetails: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      diningRoomDetails: {
        type: Sequelize.TEXT,
        allowNull: true,
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BuildingDetails');
  },
};
