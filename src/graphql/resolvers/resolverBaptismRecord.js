const baptismRecordService = require('../../services/baptismRecord');
const validateContext = require('../../utils/validateContext');
const resolversBaptismRecord = {
  BaptismRecordQuery: {
    getAll: async (args, context) => {
      console.log('BaptismRecord - getAll - Inicio:', new Date().toISOString());
      console.log('BaptismRecord - getAll - User:', context.user);
      console.log('BaptismRecord - getAll - Args:', args);
      validateContext(context.user, 'BaptismRecord');
      const baptismRecords = await baptismRecordService.getAllBaptismRecords();

      console.log('BaptismRecord - getAll - Respuesta:', baptismRecords[0]);
      console.log('BaptismRecord - getAll - Fin:', new Date().toISOString());
      return baptismRecords;
    },
    getById: async (args, context) => {
      console.log('BaptismRecord - getById - Inicio:', new Date().toISOString());
      console.log('BaptismRecord - getById - User:', context.user);
      console.log('BaptismRecord - getById - Args:', args);
      validateContext(context.user, 'BaptismRecord');
      const baptismRecord = await baptismRecordService.getBaptismRecordById(args.id);
      console.log('BaptismRecord - getById - Respuesta:', baptismRecord);
      console.log('BaptismRecord - getById - Fin:', new Date().toISOString());
      return baptismRecord;
    },
  },

  BaptismRecordMutation: {
    create: async (args, context) => {
      console.log('BaptismRecord - create - Inicio:', new Date().toISOString());
      console.log('BaptismRecord - create - User:', context.user);
      console.log('BaptismRecord - create - Args:', args);
      validateContext(context.user, 'BaptismRecord');
      const response = await baptismRecordService.createBaptismRecord(args.baptismRecord);
      console.log('BaptismRecord - create - Respuesta:', response);
      console.log('BaptismRecord - create - Fin:', new Date().toISOString());
      return response;
    },
    update: async (args, context) => {
      console.log('BaptismRecord - update - Inicio:', new Date().toISOString());
      console.log('BaptismRecord - update - User:', context.user);
      console.log('BaptismRecord - update - Args:', args);
      validateContext(context.user, 'BaptismRecord');
      const response = await baptismRecordService.updateBaptismRecord(args.baptismRecord);
      console.log('BaptismRecord - update - Respuesta:', response);
      console.log('BaptismRecord - update - Fin:', new Date().toISOString());
      return response;
    },
    delete: async (args, context) => {
      console.log('BaptismRecord - delete - Inicio:', new Date().toISOString());
      console.log('BaptismRecord - delete - User:', context.user);
      console.log('BaptismRecord - delete - Args:', args);
      validateContext(context.user, 'BaptismRecord');
      const response = await baptismRecordService.deleteBaptismRecord(args.id);
      console.log('BaptismRecord - delete - Respuesta:', response);
      console.log('BaptismRecord - delete - Fin:', new Date().toISOString());
      return response;
    },
  },
};

module.exports = resolversBaptismRecord;
