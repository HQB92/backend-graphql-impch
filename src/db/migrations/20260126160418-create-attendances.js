'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Attendances', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      rehearsalId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Rehearsals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      memberRut: {
        type: Sequelize.STRING(12),
        allowNull: false,
        references: {
          model: 'Members',
          key: 'rut',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      attendedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
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

    // Crear índice único para evitar duplicados de asistencia
    await queryInterface.addIndex('Attendances', ['rehearsalId', 'memberRut'], {
      unique: true,
      name: 'unique_rehearsal_member',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Attendances', 'unique_rehearsal_member');
    await queryInterface.dropTable('Attendances');
  },
};
