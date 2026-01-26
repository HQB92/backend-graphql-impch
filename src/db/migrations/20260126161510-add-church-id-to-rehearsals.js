'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Agregar columna churchId
    await queryInterface.addColumn('Rehearsals', 'churchId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Churches',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Eliminar columna location
    await queryInterface.removeColumn('Rehearsals', 'location');
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir: agregar location de vuelta
    await queryInterface.addColumn('Rehearsals', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Revertir: eliminar churchId
    await queryInterface.removeColumn('Rehearsals', 'churchId');
  },
};
