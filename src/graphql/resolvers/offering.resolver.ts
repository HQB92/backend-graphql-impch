import {validateContext} from '../../utils/tokensLogs';
import {logger} from '../../utils/logger';
import offering from "../../services/offering.service";
import BankService from "../../services/bank.service";

const resolversOffering = {
	OfferingQuery: {
		getAll: async (args:any, context:any) => {
			logger.logStart('Offering - getAll');
			logger.logUser('Offering - getAll', context.user);
			logger.logArgs('Offering - getAll', args);
			validateContext(context.user, 'Offering');
			try {
				const offerings = await offering.getAllOfferings(args.user, args.churchId, args.mes, args.anio);
				logger.logResponses('Offering - getAll', offerings);
				return offerings;
			} catch (error) {
				logger.logError('Offering - getAll', error);
				throw error;
			} finally {
				logger.logEnd('Offering - getAll');
			}

		},
		getSummaryAll: async (args:any, context:any) => {
			logger.logStart('Offering - getSummaryAll');
			logger.logUser('Offering - getSummaryAll', context.user);
			logger.logArgs('Offering - getSummaryAll', args);

			// Validar el contexto
			validateContext(context.user, 'Offering');

			try {
				// Obtener el resumen de ofrendas
				let summary = await offering.getSummaryAll(args.mes, args.anio, args.churchId);
				logger.logResponses('Offering - getSummaryAll', summary);

				// Manejar caso de no encontrar resultados
				if (!summary) {
					return {
						code: 404,
						message: 'No se encontraron resultados para el mes y año especificados',
					};
				}

				// Verificar si summary es un array
				if (!Array.isArray(summary)) {
					console.error("Expected summary to be an array but got", typeof summary);
					summary = [];
				}

				// Obtener el resumen del banco
				const response:any = await BankService.getSummaryBank(args.mes, args.anio);
				logger.logResponses('Offering - getSummaryBank', response);

				// Mapear el resumen de ofrendas
				let result:any = [];
				if (!summary.length) {
					summary = [];
				}else {
					result = summary.map((item) => ({
						churchId: item?.dataValues?.churchId,
						name: item?.dataValues?.name,
						total: item?.dataValues?.total,
						count: item?.dataValues?.count
					}));
				}
				// Añadir los datos del banco al resultado
				if (response.code !== 404 ) {
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
		create: async (args:any, context:any) => {

			logger.logStart('Offering - create');
			logger.logUser('Offering - create', context.user);
			logger.logArgs('Offering - create', args);
			validateContext(context.user, 'Offering');
			try {
				const offeringData = await offering.createOffering(args.offering);
				logger.logResponse('Offering - create', offeringData);
				return offeringData;
			} catch (error) {
				logger.logError('Offering - create', error);
				throw error;
			} finally {
				logger.logEnd('Offering - create');
			}
		},
		update: async (args:any, context:any) => {
			logger.logStart('Offering - update');
			logger.logUser('Offering - update', context.user);
			logger.logArgs('Offering - update', args);
			validateContext(context.user, 'Offering');
			try {
				const offeringData = await offering.updateOffering(args.offering, args.offering.id);
				logger.logResponse('Offering - update', offeringData);
				return offeringData;
			} catch (error) {
				logger.logError('Offering - update', error);
				throw error;
			} finally {
				logger.logEnd('Offering - update');
			}
		},
		delete: async (args:any, context:any) => {
			logger.logStart('Offering - delete');
			logger.logUser('Offering - delete', context.user);
			logger.logArgs('Offering - delete', args);
			validateContext(context.user, 'Offering');
			try {
				const offeringData:any = await offering.deleteOffering(args.id);
				logger.logResponse('Offering - delete', offering);
				return offeringData;
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