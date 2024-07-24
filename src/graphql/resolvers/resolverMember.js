const memberService = require('../../services/member');
const { validateContext } = require('../../utils/tokensLogs');
const logger = require('../../utils/logger');

const resolversMember = {
  MemberQuery: {
    getAll: async (args, context) => {
        logger.logStart('Member - getAll')
        logger.logUser('Member - getAll', context.user);
        logger.logArgs('Member - getAll', args);
        validateContext(context.user, 'Member');
        try {
            const members = await memberService.getAllMembers(args);
            logger.logResponses('Member - getAll', members);
            return members;
        }catch (error) {
            logger.logError('Member - getAll', error);
            throw error;
        }finally {
            logger.logEnd('Member - getAll');
        }
    },
    getByRut: async (args, context) => {
       logger.logStart('Member - getByRut')
       logger.logUser('Member - getByRut', context.user);
       logger.logArgs('Member - getByRut', args);
       validateContext(context.user, 'Member');
       try {
          const member = await memberService.getMemberByRut(args.rut);
          logger.logResponse('Member - getByRut', member);
          return member;
       }catch (error) {
          logger.logError('Member - getByRut', error);
          throw error;
       }finally {
          logger.logEnd('Member - getByRut');
       }

    },
    count: async (args, context) => {
        logger.logStart('Member - count')
        logger.logUser('Member - count', context.user);
        logger.logArgs('Member - count', args);
        validateContext(context.user, 'Member');
        try {
            const count = await memberService.countMembers();
            logger.logResponse('Member - count', count);
            return count;
        }catch (error) {
            logger.logError('Member - count', error);
            throw error;
        }finally {
            logger.logEnd('Member - count');
        }
    },
  },

  MemberMutation: {
    create: async (args, context) => {
      logger.logStart('Member - create')
      logger.logUser('Member - create', context.user);
      logger.logArgs('Member - create', args);
      validateContext(context.user, 'Member');
      try {
        const response = await memberService.createMember(args.member);
        logger.logResponse('Member - create', response);
        return response;
      }catch (error) {
        logger.logError('Member - create', error);
        throw error;
      }finally {
          logger.logEnd('Member - create');
      }
    },
    update: async (args, context) => {
        logger.logStart('Member - update')
        logger.logUser('Member - update', context.user);
        logger.logArgs('Member - update', args);
        validateContext(context.user, 'Member');
        try {
            const response = await memberService.updateMember(args.member);
            logger.logResponse('Member - update', response);
            return response;
        }catch (error) {
            logger.logError('Member - update', error);
            throw error;
        }finally {
            logger.logEnd('Member - update');
        }
    },
    delete: async (args, context) => {
        logger.logStart('Member - delete')
        logger.logUser('Member - delete', context.user);
        logger.logArgs('Member - delete', args);
        validateContext(context.user, 'Member');
        try {
            const response = await memberService.deleteMember(args.id);
            logger.logResponse('Member - delete', response);
            return response;
        }catch (error) {
            logger.logError('Member - delete', error);
            throw error;
        }finally {
            logger.logEnd('Member - delete');
        }
    },
  },
};

module.exports = resolversMember;