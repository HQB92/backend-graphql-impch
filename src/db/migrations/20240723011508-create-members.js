'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Members', {
      rut: {
        type: Sequelize.STRING(12),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      names: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastNameDad: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastNameMom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      telephone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      maritalStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      probationStartDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fullMembershipDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      churchId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Churches',
          key: 'id',
        },
      },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Statuses',
          key: 'id',
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      sexo: {
        type: Sequelize.STRING(10),
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
    await queryInterface.dropTable('Members');
  },
};
