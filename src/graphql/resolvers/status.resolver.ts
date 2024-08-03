import statusService from '../../services/status.service';
import {validateContext} from '../../utils/tokensLogs';
import {logger} from '../../utils/logger';

const resolversStatus = {
  StatusQuery: {
    getAll: async (args:any, context:any) => {
      logger.logStart('Status - getAll')
      logger.logUser('Status - getAll', context.user);
      logger.logArgs('Status - getAll', args);
      validateContext(context.user, 'Status');
      try {
        const status = await statusService.getAllStatuses();
        logger.logResponses('Status - getAll', status);
        return status;
      }catch (error) {
        logger.logError('Status - getAll', error);
        throw error;
      }finally {
        logger.logEnd('Status - getAll');
      }
    },
    getById: async (args:any, context:any) => {
        logger.logStart('Status - getById')
        logger.logUser('Status - getById', context.user);
        logger.logArgs('Status - getById', args);
        validateContext(context.user, 'Status');
        try {
            const status = await statusService.getStatusById(args.id);
            logger.logResponse('Status - getById', status);
            return status;
        }catch (error) {
            logger.logError('Status - getById', error);
            throw error;
        }finally {
          logger.logEnd('Status - getById');
        }
    },
  },

  StatusMutation: {
    create: async (args:any, context:any) => {
        logger.logStart('Status - create')
        logger.logUser('Status - create', context.user);
        logger.logArgs('Status - create', args);
        validateContext(context.user, 'Status');
        try {
            const response = await statusService.createStatus(args.status);
            logger.logResponse('Status - create', response);
            return response;
        }catch (error) {
            logger.logError('Status - create', error);
            throw error;
        }finally {
            logger.logEnd('Status - create');
        }
    },
    update: async (args:any, context:any) => {
        logger.logStart('Status - update')
        logger.logUser('Status - update', context.user);
        logger.logArgs('Status - update', args);
        validateContext(context.user, 'Status');
        try {
            const response = await statusService.updateStatus(args.status);
            logger.logResponse('Status - update', response);
            return response;
        }catch (error) {
            logger.logError('Status - update', error);
            throw error;
        }finally {
          logger.logEnd('Status - update');
        }
    },
    delete: async (args:any, context:any) => {
        logger.logStart('Status - delete')
        logger.logUser('Status - delete', context.user);
        logger.logArgs('Status - delete', args);
        validateContext(context.user, 'Status');
        try {
            const response = await statusService.deleteStatus(args.id);
            logger.logResponse('Status - delete', response);
            return response;
        }catch (error) {
            logger.logError('Status - delete', error);
            throw error;
        }finally {
          logger.logEnd('Status - delete');
        }
    },
  },
};

export default resolversStatus;
