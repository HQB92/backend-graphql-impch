const statusService = require('../../services/status');
const validateContext = require('../../utils/validateContext');

const resolversStatus = {
  StatusQuery: {
    getAll: async (args, context) => {
      console.log('Status - getAll - Inicio:', new Date().toISOString());
      console.log('Status - getAll - User:', context.user);
      console.log('Status - getAll - Args:', args);
      validateContext(context.user, "Status");
      const statuses = await statusService.getAllStatuses();
      console.log('Status - getAll - Respuesta:', statuses);
      console.log('Status - getAll - Fin:', new Date().toISOString());
      return statuses;
    },
    getById: async (args, context) => {
      console.log('Status - getById - Inicio:', new Date().toISOString());
      console.log('Status - getById - User:', context.user);
      console.log('Status - getById - Args:', args);
      validateContext(context.user, "Status");
      const status = await statusService.getStatusById(args.id);
      console.log('Status - getById - Respuesta:', status);
      console.log('Status - getById - Fin:', new Date().toISOString());
      return status;
    },
  },

  StatusMutation: {
    create: async (args, context) => {
      console.log('Status - create - Inicio:', new Date().toISOString());
      console.log('Status - create - User:', context.user);
      console.log('Status - create - Args:', args);
      validateContext(context.user, "Status");
      const response = await statusService.createStatus(args.status);
      console.log('Status - create - Respuesta:', response);
      console.log('Status - create - Fin:', new Date().toISOString());
      return response;
    },
    update: async (args, context) => {
      console.log('Status - update - Inicio:', new Date().toISOString());
      console.log('Status - update - User:', context.user);
      console.log('Status - update - Args:', args);
      validateContext(context.user, "Status");
      const response = await statusService.updateStatus(args.status);
      console.log('Status - update - Respuesta:', response);
      console.log('Status - update - Fin:', new Date().toISOString());
      return response;
    },
    delete: async (args, context) => {
      console.log('Status - delete - Inicio:', new Date().toISOString());
      console.log('Status - delete - User:', context.user);
      console.log('Status - delete - Args:', args);
      validateContext(context.user, "Status");
      const response = await statusService.deleteStatus(args.id);
      console.log('Status - delete - Respuesta:', response);
      console.log('Status - delete - Fin:', new Date().toISOString());
      return response;
    },
  },
};

module.exports = resolversStatus;
