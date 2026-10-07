import { validateContext } from '../../utils/tokensLogs';
import logger from '../../utils/logger';
import { GraphQLContext } from '../types';

// Envuelve un resolver de sector: registra inicio y fin, valida el acceso al
// servicio y propaga los errores. No registra los argumentos porque pueden
// traer claves.
export const runSector = async <T>(
    operation: string,
    service: string,
    context: GraphQLContext,
    fn: () => Promise<T>
): Promise<T> => {
    logger.logStart(operation);
    logger.logUser(operation, context.user);
    try {
        validateContext(context.user, service);
        return await fn();
    } catch (error) {
        logger.logError(operation, error);
        throw error;
    } finally {
        logger.logEnd(operation);
    }
};

// bindContextToResolvers entrega los argumentos del campo en `parent` y las
// variables de la operación en `args`. Se prefieren los del campo.
export const arg = (parent: any, args: any, name: string): any => {
    return parent?.[name] ?? args?.[name];
};
