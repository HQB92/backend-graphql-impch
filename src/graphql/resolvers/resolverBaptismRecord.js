const baptismRecordService = require('../../services/baptismRecord');
const { validateContext } = require('../../utils/validateContext');
const resolversBaptismRecord = {
  BaptismRecordQuery: {
    getAll: async (parent, args, context) => {
      console.log('getAll - Inicio:', new Date().toISOString());
      console.log('getAll - Args:', args);
      validateContext(context.user);
      const baptismRecords = await baptismRecordService.getAllBaptismRecords();
      console.log('getAll - Respuesta:', baptismRecords);
      console.log('getAll - Fin:', new Date().toISOString());
      return baptismRecords;
    },
    getById: async (parent, args, context) => {
      console.log('getById - Inicio:', new Date().toISOString());
      console.log('getById - Args:', args);
      validateContext(context.user);
      const baptismRecord = await baptismRecordService.getBaptismRecordById(args.id);
      console.log('getById - Respuesta:', baptismRecord);
      console.log('getById - Fin:', new Date().toISOString());
      return baptismRecord;
    },
  },

  BaptismRecordMutation: {
    create: async (parent, args, context) => {
      console.log('create - Inicio:', new Date().toISOString());
      console.log('create - Args:', args);
      validateContext(context.user);
      const response = await baptismRecordService.createBaptismRecord(args.baptismRecord);
      console.log('create - Respuesta:', response);
      console.log('create - Fin:', new Date().toISOString());
      return response;
    },
    update: async (parent, args, context) => {
      console.log('update - Inicio:', new Date().toISOString());
      console.log('update - Args:', args);
      validateContext(context.user);
      const response = await baptismRecordService.updateBaptismRecord(args.baptismRecord);
      console.log('update - Respuesta:', response);
      console.log('update - Fin:', new Date().toISOString());
      return response;
    },
    delete: async (parent, args, context) => {
      console.log('delete - Inicio:', new Date().toISOString());
      console.log('delete - Args:', args);
      validateContext(context.user);
      const response = await baptismRecordService.deleteBaptismRecord(args.id);
      console.log('delete - Respuesta:', response);
      console.log('delete - Fin:', new Date().toISOString());
      return response;
    },
  },
};

module.exports = resolversBaptismRecord;
