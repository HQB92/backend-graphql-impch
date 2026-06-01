'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Soft-delete en registros financieros
    await queryInterface.addColumn('Offerings', 'deleted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('Banks', 'deleted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    // Índices para filtros por iglesia + fecha
    await queryInterface.addIndex('Offerings', ['churchId', 'date'], {
      name: 'idx_offerings_church_date',
    });
    await queryInterface.addIndex('Banks', ['churchId', 'date'], {
      name: 'idx_banks_church_date',
    });

    // dateOfBirth: DATE -> DATEONLY
    await queryInterface.changeColumn('Members', 'dateOfBirth', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Offerings', 'idx_offerings_church_date');
    await queryInterface.removeIndex('Banks', 'idx_banks_church_date');
    await queryInterface.removeColumn('Offerings', 'deleted');
    await queryInterface.removeColumn('Banks', 'deleted');
    await queryInterface.changeColumn('Members', 'dateOfBirth', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  }
};
