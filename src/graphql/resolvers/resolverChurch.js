const churchService = require('../../services/church');
const { validateContext }  = require('../../utils/tokensLogs');
const logger = require('../../utils/logger');

const resolversChurch = {
  ChurchQuery: {
    getAll: async (args, context) => {
      logger.logStart('Church - getAll')
      logger.logUser('Church - getAll', context.user);
      logger.logArgs('Church - getAll', args);
      validateContext(context.user, 'Church');
      try {
        const churches = await churchService.getAllChurches();
        logger.logResponses('Church - getAll', churches);
        return churches;
      }catch (error) {
        logger.logError('Church - getAll', error);
        throw error;
      }finally {
        logger.logEnd('Church - getAll');
      }
    },
    getById: async (args, context) => {
        logger.logStart('Church - getById')
        logger.logUser('Church - getById', context.user);
        logger.logArgs('Church - getById', args);
        validateContext(context.user, 'Church');
        try {
            const church = await churchService.getChurchById(args.id);
            logger.logResponse('Church - getById', church);
            return church;
        }catch (error) {
            logger.logError('Church - getById', error);
            throw error;
        }finally {
            logger.logEnd('Church - getById');
        }
    },
  },

  ChurchMutation: {
    create: async (args, context) => {
        logger.logStart('Church - create')
        logger.logUser('Church - create', context.user);
        logger.logArgs('Church - create', args);
        validateContext(context.user, 'Church');
        try {
            const response = await churchService.createChurch(args.church);
            logger.logResponse('Church - create', response);
            return response;
        }catch (error) {
            logger.logError('Church - create', error);
            throw error;
        }finally {
            logger.logEnd('Church - create');
        }
    },
    update: async (args, context) => {
        logger.logStart('Church - update')
        logger.logUser('Church - update', context.user);
        logger.logArgs('Church - update', args);
        validateContext(context.user, 'Church');
        try {
            const response = await churchService.updateChurch(args.church);
            logger.logResponse('Church - update', response);
            return response;
        }catch (error) {
            logger.logError('Church - update', error);
            throw error;
        }finally {
            logger.logEnd('Church - update');
        }
    },
    delete: async (args, context) => {
        logger.logStart('Church - delete')
        logger.logUser('Church - delete', context.user);
        logger.logArgs('Church - delete', args);
        validateContext(context.user, 'Church');
        try {
            const response = await churchService.deleteChurch(args.id);
            logger.logResponse('Church - delete', response);
            return response;
        }catch (error) {
            logger.logError('Church - delete', error);
            throw error;
        }finally {
            logger.logEnd('Church - delete');
        }
    },
  },
};

module.exports = resolversChurch;
