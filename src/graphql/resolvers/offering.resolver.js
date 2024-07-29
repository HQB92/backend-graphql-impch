const {validateContext} = require('../../utils/tokensLogs');
const logger = require('../../utils/logger');
const offering = require("../../services/offering.service");
const resolversOffering = {
	OfferingQuery: {
		getAll: async (args, context) => {
			logger.logStart('Offering - getAll');
			logger.logUser('Offering - getAll', context.user);
			logger.logArgs('Offering - getAll', args);
			validateContext(context.user, 'Offering');
			try {
				const offerings = await offering.getAllOfferings(args.user, args.churchId);
				logger.logResponses('Offering - getAll', offerings);
				return offerings;
			} catch (error) {
				logger.logError('Offering - getAll', error);
				throw error;
			} finally {
				logger.logEnd('Offering - getAll');
			}

		},
	},
	OfferingMutation: {
		create: async (args, context) => {

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
		update: async (args, context) => {
			logger.logStart('Offering - update');
			logger.logUser('Offering - update', context.user);
			logger.logArgs('Offering - update', args);
			validateContext(context.user, 'Offering');
			try {
				const offeringData = await offering.updateOffering(args.offering);
				logger.logResponse('Offering - update', offeringData);
				return offeringData;
			} catch (error) {
				logger.logError('Offering - update', error);
				throw error;
			} finally {
				logger.logEnd('Offering - update');
			}
		},
		delete: async (args, context) => {
			logger.logStart('Offering - delete');
			logger.logUser('Offering - delete', context.user);
			logger.logArgs('Offering - delete', args);
			validateContext(context.user, 'Offering');
			try {
				const offering = await offering.deleteOffering(args.id);
				logger.logResponse('Offering - delete', offering);
				return offering;
			} catch (error) {
				logger.logError('Offering - delete', error);
				throw error;
			} finally {
				logger.logEnd('Offering - delete');
			}
		},
	}
}
	module.exports = resolversOffering;