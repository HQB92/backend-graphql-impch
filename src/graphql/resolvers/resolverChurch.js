const churchService = require('../../services/church');
const  validateContext  = require('../../utils/validateContext');

const resolversChurch = {
  ChurchQuery: {
    getAll: async (args, context) => {
      console.log('Church - getAll - Inicio:', new Date().toISOString());
      console.log('Church - getAll - User:', context.user);
      console.log('Church - getAll - Args:', args);
      validateContext(context.user, "Church");
      const churches = await churchService.getAllChurches();
      churches.forEach((churche, index) => {
        console.log('Churches - getAll - Respuesta[',index,'] :', churche?.dataValues);
      });
      console.log('Church - getAll - Respuesta:', churches);
      console.log('Church - getAll - Fin:', new Date().toISOString());
      return churches;
    },
    getById: async (args, context) => {
      console.log('Church - getById - Inicio:', new Date().toISOString());
      console.log('Church - getById - User:', context.user);
      console.log('Church - getById - Args:', args);
      validateContext(context.user, "Church");
      const church = await churchService.getChurchById(args.id);
      console.log('Church - getById - Respuesta:', church);
      console.log('Church - getById - Fin:', new Date().toISOString());
      return church;
    },
  },

  ChurchMutation: {
    create: async (args, context) => {
      console.log('Church - create - Inicio:', new Date().toISOString());
      console.log('Church - create - User:', context.user);
      console.log('Church - create - Args:', args);
      validateContext(context.user, "Church");
      const response = await churchService.createChurch(args.church);
      response.forEach((church) => {
        let count = 1;
        console.log('Church - create - Respuesta[',count,'] :', church?.dataValues);
        count++;
      })
      console.log('Church - create - Fin:', new Date().toISOString());
      return response;
    },
    update: async (args, context) => {
      console.log('Church - update - Inicio:', new Date().toISOString());
      console.log('Church - update - User:', context.user);
      console.log('Church - update - Args:', args);
      validateContext(context.user, "Church");
      const response = await churchService.updateChurch(args.church);
      console.log('Church - update - Respuesta:', response);
      console.log('Church - update - Fin:', new Date().toISOString());
      return response;
    },
    delete: async (args, context) => {
      console.log('Church - delete - Inicio:', new Date().toISOString());
      console.log('Church - delete - User:', context.user);
      console.log('Church - delete - Args:', args);
      validateContext(context.user, "Church");
      const response = await churchService.deleteChurch(args.id);
      console.log('Church - delete - Respuesta:', response);
      console.log('Church - delete - Fin:', new Date().toISOString());
      return response;
    },
  },
};

module.exports = resolversChurch;
