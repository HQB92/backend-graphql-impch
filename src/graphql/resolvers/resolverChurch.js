const churchService = require('../../services/church');
const { validateContext } = require('../../utils/validateContext');

const resolversChurch = {
  ChurchQuery: {
    getAll: async (parent, args, context) => {
      console.log('getAll - Inicio:', new Date().toISOString());
      console.log('getAll - Args:', args);
      validateContext(context.user);
      const churches = await churchService.getAllChurches();
      console.log('getAll - Respuesta:', churches);
      console.log('getAll - Fin:', new Date().toISOString());
      return churches;
    },
    getById: async (parent, args, context) => {
      console.log('getById - Inicio:', new Date().toISOString());
      console.log('getById - Args:', args);
      validateContext(context.user);
      const church = await churchService.getChurchById(args.id);
      console.log('getById - Respuesta:', church);
      console.log('getById - Fin:', new Date().toISOString());
      return church;
    },
  },

  ChurchMutation: {
    create: async (parent, args, context) => {
      console.log('create - Inicio:', new Date().toISOString());
      console.log('create - Args:', args);
      validateContext(context.user);
      const response = await churchService.createChurch(args.church);
      console.log('create - Respuesta:', response);
      console.log('create - Fin:', new Date().toISOString());
      return response;
    },
    update: async (parent, args, context) => {
      console.log('update - Inicio:', new Date().toISOString());
      console.log('update - Args:', args);
      validateContext(context.user);
      const response = await churchService.updateChurch(args.church);
      console.log('update - Respuesta:', response);
      console.log('update - Fin:', new Date().toISOString());
      return response;
    },
    delete: async (parent, args, context) => {
      console.log('delete - Inicio:', new Date().toISOString());
      console.log('delete - Args:', args);
      validateContext(context.user);
      const response = await churchService.deleteChurch(args.id);
      console.log('delete - Respuesta:', response);
      console.log('delete - Fin:', new Date().toISOString());
      return response;
    },
  },
};

module.exports = resolversChurch;
