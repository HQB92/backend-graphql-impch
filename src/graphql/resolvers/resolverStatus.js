const Status = require('../../models');

const resolversStatus = {
  StatusQuery: {
    getAll: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      return await Status.findAll();
    },
    getById: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      return await Status.findOne({ where: { id: args.id } });
    },
  },

  StatusMutation: {
    create: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      const { name, description } = args;
      return await Status.create({ name, description });
    },
    update: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      const { name, description } = args;
      return await Status.update(
        { name, description },
        { where: { id: args.id } }
      );
    },
    delete: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      return await Status.destroy({ where: { id: args.id } });
    },
  },
};

module.exports = resolversStatus;
