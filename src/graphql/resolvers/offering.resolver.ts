import * as offeringService from '../../services/offering.service';
import * as bankService from '../../services/bank.service';
import { validateContext } from '../../utils/tokensLogs';
import logger from '../../utils/logger';
import { GraphQLContext, GraphQLArgs } from '../types';

const resolversOffering = {
    OfferingQuery: {
        getAll: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Offering - getAll');
            logger.logUser('Offering - getAll', context.user);
            logger.logArgs('Offering - getAll', args);
            validateContext(context.user, 'Offering');
            try {
                const offerings = await offeringService.getAllOfferings(args.user, args.churchId, args.mes, args.anio);
                if (Array.isArray(offerings)) {
                    logger.logResponses('Offering - getAll', offerings);
                } else {
                    logger.logResponse('Offering - getAll', offerings);
                }
                return offerings;
            } catch (error) {
                logger.logError('Offering - getAll', error);
                throw error;
            } finally {
                logger.logEnd('Offering - getAll');
            }
        },
        getSummaryAll: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Offering - getSummaryAll');
            logger.logUser('Offering - getSummaryAll', context.user);
            logger.logArgs('Offering - getSummaryAll', args);

            validateContext(context.user, 'Offering');

            try {
                let summary = await offeringService.getSummaryAll(args.mes!, args.anio!, args.churchId);
                logger.logResponses('Offering - getSummaryAll', summary);

                if (!summary) {
                    return {
                        code: 404,
                        message: 'No se encontraron resultados para el mes y año especificados',
                    };
                }

                if (!Array.isArray(summary)) {
                    console.error("Expected summary to be an array but got", typeof summary);
                    summary = [];
                }

                const response = await bankService.getSummaryBank(args.mes!, args.anio!);
                logger.logResponses('Offering - getSummaryBank', response);

                let result: any[] = [];
                if (!summary.length) {
                    summary = [];
                } else {
                    result = summary.map((item: any) => ({
                        churchId: item?.dataValues?.churchId,
                        name: item?.dataValues?.name,
                        total: item?.dataValues?.total,
                        count: item?.dataValues?.count
                    }));
                }

                console.log("response", response);
                if (response.code !== 404) {
                    result.push({
                        churchId: 1,
                        name: "Banco",
                        total: response[0]?.dataValues?.total,
                        count: response[0]?.dataValues?.count
                    });
                }
                return result;

            } catch (error) {
                logger.logError('Offering - getSummaryAll', error);
                throw error;
            } finally {
                logger.logEnd('Offering - getSummaryAll');
            }
        }
    },
    OfferingMutation: {
        create: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Offering - create');
            logger.logUser('Offering - create', context.user);
            logger.logArgs('Offering - create', args);
            validateContext(context.user, 'Offering');
            try {
                const offeringData = await offeringService.createOffering(args.offering);
                logger.logResponse('Offering - create', offeringData);
                return offeringData;
            } catch (error) {
                logger.logError('Offering - create', error);
                throw error;
            } finally {
                logger.logEnd('Offering - create');
            }
        },
        update: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Offering - update');
            logger.logUser('Offering - update', context.user);
            logger.logArgs('Offering - update', args);
            validateContext(context.user, 'Offering');
            try {
                const offeringData = await offeringService.updateOffering(args.offering, args.id!);
                logger.logResponse('Offering - update', offeringData);
                return offeringData;
            } catch (error) {
                logger.logError('Offering - update', error);
                throw error;
            } finally {
                logger.logEnd('Offering - update');
            }
        },
        delete: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Offering - delete');
            logger.logUser('Offering - delete', context.user);
            logger.logArgs('Offering - delete', args);
            validateContext(context.user, 'Offering');
            try {
                const offeringResult = await offeringService.deleteOffering(args.id!);
                logger.logResponse('Offering - delete', offeringResult);
                return offeringResult;
            } catch (error) {
                logger.logError('Offering - delete', error);
                throw error;
            } finally {
                logger.logEnd('Offering - delete');
            }
        },
    }
}

export default resolversOffering;
