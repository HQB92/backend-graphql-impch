import * as expenseService from '../../services/expense.service';
import { validateContext, effectiveChurchId } from '../../utils/tokensLogs';
import logger from '../../utils/logger';
import { GraphQLContext, GraphQLArgs } from '../types';

const resolversExpense = {
    ExpenseQuery: {
        getAll: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Expense - getAll');
            logger.logUser('Expense - getAll', context.user);
            logger.logArgs('Expense - getAll', args);
            validateContext(context.user, 'Expense');
            try {
                const expenses = await expenseService.getAllExpenses(
                    effectiveChurchId(context.user, args.churchId),
                    args.mes,
                    args.anio,
                    args.source
                );
                logger.logResponses('Expense - getAll', expenses);
                return expenses;
            } catch (error) {
                logger.logError('Expense - getAll', error);
                throw error;
            } finally {
                logger.logEnd('Expense - getAll');
            }
        },
        getById: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Expense - getById');
            validateContext(context.user, 'Expense');
            try {
                const expense = await expenseService.getExpenseById(Number(args.id));
                logger.logResponse('Expense - getById', expense);
                return expense;
            } catch (error) {
                logger.logError('Expense - getById', error);
                throw error;
            } finally {
                logger.logEnd('Expense - getById');
            }
        },
        getSummary: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Expense - getSummary');
            validateContext(context.user, 'Expense');
            try {
                const summary = await expenseService.getSummaryExpenses(
                    args.mes!,
                    args.anio!,
                    effectiveChurchId(context.user, args.churchId)
                );
                logger.logResponse('Expense - getSummary', summary);
                return summary;
            } catch (error) {
                logger.logError('Expense - getSummary', error);
                throw error;
            } finally {
                logger.logEnd('Expense - getSummary');
            }
        },
    },

    ExpenseMutation: {
        create: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Expense - create');
            logger.logUser('Expense - create', context.user);
            logger.logArgs('Expense - create', args);
            validateContext(context.user, 'Expense');
            try {
                const churchId = effectiveChurchId(context.user, args.expense?.churchId);
                if (!churchId) {
                    return { code: 400, message: 'churchId es requerido' };
                }
                const data = args.expense as any;
                const response = await expenseService.createExpense({
                    amount: Number(data.amount),
                    date: data.date,
                    type: data.type || null,
                    description: data.description || null,
                    source: data.source === 'BANCO' ? 'BANCO' : 'CAJA',
                    churchId,
                    userId: context.user!.userId,
                });
                logger.logResponse('Expense - create', response);
                return response;
            } catch (error) {
                logger.logError('Expense - create', error);
                throw error;
            } finally {
                logger.logEnd('Expense - create');
            }
        },
        update: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Expense - update');
            validateContext(context.user, 'Expense');
            try {
                const data = args.expense as any;
                const updateData: any = {};
                if (data.amount !== undefined) updateData.amount = Number(data.amount);
                if (data.date !== undefined) updateData.date = data.date;
                if (data.type !== undefined) updateData.type = data.type;
                if (data.description !== undefined) updateData.description = data.description;
                if (data.source !== undefined) updateData.source = data.source === 'BANCO' ? 'BANCO' : 'CAJA';

                const response = await expenseService.updateExpense(Number(args.id), updateData);
                logger.logResponse('Expense - update', response);
                return response;
            } catch (error) {
                logger.logError('Expense - update', error);
                throw error;
            } finally {
                logger.logEnd('Expense - update');
            }
        },
        delete: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Expense - delete');
            validateContext(context.user, 'Expense');
            try {
                const response = await expenseService.deleteExpense(Number(args.id));
                logger.logResponse('Expense - delete', response);
                return response;
            } catch (error) {
                logger.logError('Expense - delete', error);
                throw error;
            } finally {
                logger.logEnd('Expense - delete');
            }
        },
    },
};

export default resolversExpense;
