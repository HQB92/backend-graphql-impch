'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SectorBaptismRecords', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      childRUT: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      childFullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      childDateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      fatherRUT: {
        type: Sequelize.STRING(12),
        allowNull: true,
      },
      fatherFullName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      motherRUT: {
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

    await queryInterface.addIndex('SectorBaptismRecords', ['sectorChurchId'], {
      name: 'idx_sector_baptism_church',
    });

    // Un RUT de niño no puede tener dos bautizos activos en el sector.
    await queryInterface.addIndex('SectorBaptismRecords', ['childRUT'], {
      name: 'uq_sector_baptism_child_rut_active',
      unique: true,
      where: { deleted: false },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('SectorBaptismRecords');
  }
};
