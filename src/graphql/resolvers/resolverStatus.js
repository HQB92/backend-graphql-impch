const statusService = require('../../services/status');
const validateContext = require('../../utils/validateContext');

const resolversStatus = {
  StatusQuery: {
    getAll: async (args, context) => {
      console.log('getAll - Inicio:', new Date().toISOString());
      console.log('getAll - Args:', args);
      validateContext(context.user);
      const statuses = await statusService.getAllStatuses();
      console.log('getAll - Respuesta:', statuses);
      console.log('getAll - Fin:', new Date().toISOString());
      return statuses;
    },
    getById: async (args, context) => {
      console.log('getById - Inicio:', new Date().toISOString());
      console.log('getById - Args:', args);
      validateContext(context.user);
      const status = await statusService.getStatusById(args.id);
      console.log('getById - Respuesta:', status);
      console.log('getById - Fin:', new Date().toISOString());
      return status;
    },
  },

  StatusMutation: {
    create: async (args, context) => {
      console.log('create - Inicio:', new Date().toISOString());
      console.log('create - Args:', args);
      validateContext(context.user);
      const response = await statusService.createStatus(args.status);
      console.log('create - Respuesta:', response);
      console.log('create - Fin:', new Date().toISOString());
      return response;
    },
    update: async (args, context) => {
      console.log('update - Inicio:', new Date().toISOString());
      console.log('update - Args:', args);
      validateContext(context.user);
      const response = await statusService.updateStatus(args.status);
      console.log('update - Respuesta:', response);
      console.log('update - Fin:', new Date().toISOString());
      return response;
    },
    delete: async (args, context) => {
      console.log('delete - Inicio:', new Date().toISOString());
      console.log('delete - Args:', args);
      validateContext(context.user);
      const response = await statusService.deleteStatus(args.id);
      console.log('delete - Respuesta:', response);
      console.log('delete - Fin:', new Date().toISOString());
      return response;
    },
  },
};

module.exports = resolversStatus;
