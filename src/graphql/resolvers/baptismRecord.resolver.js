const baptismRecordService = require('../../services/baptismRecord.service');
const { validateContext } = require('../../utils/tokensLogs');
const logger = require('../../utils/logger');

const resolversBaptismRecord = {
  BaptismRecordQuery: {
    getAll: async (args, context) => {
      logger.logStart('BaptismRecord - getAll')
      logger.logUser('BaptismRecord - getAll', context.user);
      logger.logArgs('BaptismRecord - getAll', args);
      validateContext(context.user, 'BaptismRecord');
      try {
        const baptismRecords = await baptismRecordService.getAllBaptismRecords();
        logger.logResponses('BaptismRecord - getAll', baptismRecords);
        return baptismRecords;
      }catch (error) {
        logger.logError('BaptismRecord - getAll', error);
        throw error;
      }finally {
        logger.logEnd('BaptismRecord - getAll');
      }
    },
    getById: async (args, context) => {
      logger.logStart('BaptismRecord - getById')
      logger.logUser('BaptismRecord - getById', context.user);
      logger.logArgs('BaptismRecord - getById', args);
      validateContext(context.user, 'BaptismRecord');
      try {
        const baptismRecord = await baptismRecordService.getBaptismRecordById(args.id);
        logger.logResponse('BaptismRecord - getById', baptismRecord);
        return baptismRecord;
      }catch (error) {
        logger.logError('BaptismRecord - getById', error);
        throw error;
      }finally {
        logger.logEnd('BaptismRecord - getById');
      }
    },
    getByChildRUT: async (args, context) => {
      logger.logStart('BaptismRecord - getByChildRUT')
      logger.logUser('BaptismRecord - getByChildRUT', context.user);
      logger.logArgs('BaptismRecord - getByChildRUT', args);
      validateContext(context.user, 'BaptismRecord');
      try {
        const baptismRecord = await baptismRecordService.getBaptismRecordByChildRUT(args.childRUT);
        logger.logResponse('BaptismRecord - getByChildRUT', baptismRecord);
        return baptismRecord;
      }catch (error) {
        logger.logError('BaptismRecord - getByChildRUT', error);
        throw error;
      }finally {
        logger.logEnd('BaptismRecord - getByChildRUT');
      }
    },
  },

  BaptismRecordMutation: {
    create: async (args, context) => {
      logger.logStart('BaptismRecord - create')
      logger.logUser('BaptismRecord - create', context.user);
      logger.logArgs('BaptismRecord - create', args);
      validateContext(context.user, 'BaptismRecord');
      try {
        const response = await baptismRecordService.createBaptismRecord(args.baptismRecord);
        logger.logResponse('BaptismRecord - create', response);
        return response;
      }catch (error) {
        logger.logError('BaptismRecord - create', error);
        throw error;
      }finally {
          logger.logEnd('BaptismRecord - create');
      }
    },
    update: async (args, context) => {
        logger.logStart('BaptismRecord - update')
        logger.logUser('BaptismRecord - update', context.user);
        logger.logArgs('BaptismRecord - update', args);
        validateContext(context.user, 'BaptismRecord');
        try {
            const response = await baptismRecordService.updateBaptismRecord(args.baptismRecord);
            logger.logResponse('BaptismRecord - update', response);
            return response;
        }catch (error) {
            logger.logError('BaptismRecord - update', error);
            throw error;
        }finally {
            logger.logEnd('BaptismRecord - update');
        }
    },
    delete: async (args, context) => {
        logger.logStart('BaptismRecord - delete')
        logger.logUser('BaptismRecord - delete', context.user);
        logger.logArgs('BaptismRecord - delete', args);
        validateContext(context.user, 'BaptismRecord');
        try {
            const response = await baptismRecordService.deleteBaptismRecord(args.childRUT);
            logger.logResponse('BaptismRecord - delete', response);
            return response;
        }catch (error) {
            logger.logError('BaptismRecord - delete', error);
            throw error;
        }finally {
            logger.logEnd('BaptismRecord - delete');
        }
    },
  },
};

module.exports = resolversBaptismRecord;
