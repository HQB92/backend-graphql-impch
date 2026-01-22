import * as bankService from '../../services/bank.service';
import { validateContext } from '../../utils/tokensLogs';
import logger from '../../utils/logger';
import { GraphQLContext, GraphQLArgs } from '../types';

const resolversBank = {
    BankQuery: {
        getAll: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Bank - getAll')
            logger.logUser('Bank - getAll', context.user);
            logger.logArgs('Bank - getAll', args);
            validateContext(context.user, 'Bank');
            try {
                const banks = await bankService.getAllBanks(
                    args.churchId as number | undefined,
                    args.mes as number | undefined,
                    args.anio as number | undefined
                );
                logger.logResponses('Bank - getAll', banks);
                return banks;
            } catch (error) {
                logger.logError('Bank - getAll', error);
                throw error;
            } finally {
                logger.logEnd('Bank - getAll');
            }
        },
        getById: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Bank - getById')
            logger.logUser('Bank - getById', context.user);
            logger.logArgs('Bank - getById', args);
            validateContext(context.user, 'Bank');
            try {
                const bank = await bankService.getBankById(Number(args.id));
                logger.logResponse('Bank - getById', bank);
                return bank;
            } catch (error) {
                logger.logError('Bank - getById', error);
                throw error;
            } finally {
                logger.logEnd('Bank - getById');
            }
        },
        getSummary: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Bank - getSummary')
            logger.logUser('Bank - getSummary', context.user);
            logger.logArgs('Bank - getSummary', args);
            validateContext(context.user, 'Bank');
            try {
                const summary = await bankService.getSummaryBank(args.mes!, args.anio!);
                logger.logResponse('Bank - getSummary', summary);
                return summary;
            } catch (error) {
                logger.logError('Bank - getSummary', error);
                throw error;
            } finally {
                logger.logEnd('Bank - getSummary');
            }
        },
    },

    BankMutation: {
        create: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Bank - create')
            logger.logUser('Bank - create', context.user);
            logger.logArgs('Bank - create', args);
            validateContext(context.user, 'Bank');
            try {
                const bankData = args.bank as any;
                const response = await bankService.createBank({
                    amount: bankData.amount,
                    date: bankData.date,
                    type: bankData.type || null,
                    churchId: Number(bankData.churchId),
                    userId: context.user!.userId,
                    state: bankData.state !== undefined ? bankData.state : true,
                    comment: bankData.comment || '',
                });
                logger.logResponse('Bank - create', response);
                return response;
            } catch (error) {
                logger.logError('Bank - create', error);
                throw error;
            } finally {
                logger.logEnd('Bank - create');
            }
        },
        update: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Bank - update')
            logger.logUser('Bank - update', context.user);
            logger.logArgs('Bank - update', args);
            validateContext(context.user, 'Bank');
            try {
                const bankData = args.bank as any;
                const updateData: any = {};
                if (bankData.amount !== undefined) updateData.amount = bankData.amount;
                if (bankData.date !== undefined) updateData.date = bankData.date;
                if (bankData.type !== undefined) updateData.type = bankData.type;
                if (bankData.churchId !== undefined) updateData.churchId = Number(bankData.churchId);
                if (bankData.state !== undefined) updateData.state = bankData.state;
                if (bankData.comment !== undefined) updateData.comment = bankData.comment;
                
                const response = await bankService.updateBank(Number(args.id), updateData);
                logger.logResponse('Bank - update', response);
                return response;
            } catch (error) {
                logger.logError('Bank - update', error);
                throw error;
            } finally {
                logger.logEnd('Bank - update');
            }
        },
        delete: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Bank - delete')
            logger.logUser('Bank - delete', context.user);
            logger.logArgs('Bank - delete', args);
            validateContext(context.user, 'Bank');
            try {
                const response = await bankService.deleteBank(Number(args.id));
                logger.logResponse('Bank - delete', response);
                return response;
            } catch (error) {
                logger.logError('Bank - delete', error);
                throw error;
            } finally {
                logger.logEnd('Bank - delete');
            }
        },
    },
};

export default resolversBank;
