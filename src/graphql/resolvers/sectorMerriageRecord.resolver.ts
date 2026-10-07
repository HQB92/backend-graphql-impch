import * as sectorMerriageService from '../../services/sectorMerriageRecord.service';
import { isSectorPastor, sectorScope } from '../../utils/tokensLogs';
import { GraphQLContext, GraphQLArgs } from '../types';
import { runSector, arg } from './sector.util';

const SERVICE = 'SectorMerriageRecord';

const resolversSectorMerriageRecord = {
    SectorMerriageRecordQuery: {
        getAll: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorMerriageRecord - getAll', SERVICE, context, async () => {
                const scopeId = sectorScope(context.user, arg(parent, args, 'sectorChurchId'));
                return await sectorMerriageService.getAllSectorMerriages(scopeId);
            }),
        getById: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorMerriageRecord - getById', SERVICE, context, async () => {
                return await sectorMerriageService.getSectorMerriageById(arg(parent, args, 'id'), sectorScope(context.user));
            }),
        count: (_parent: any, _args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorMerriageRecord - count', SERVICE, context, async () => {
                return await sectorMerriageService.countSectorMerriages(sectorScope(context.user));
            }),
    },

    SectorMerriageRecordMutation: {
        create: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorMerriageRecord - create', SERVICE, context, async () => {
                // Un registro siempre nace desde la cuenta de la iglesia.
                if (!isSectorPastor(context.user)) throw new Error('No autorizado');
                const sectorChurchId = sectorScope(context.user) as number;
                return await sectorMerriageService.createSectorMerriage(arg(parent, args, 'merriageRecord'), sectorChurchId);
            }),
        update: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorMerriageRecord - update', SERVICE, context, async () => {
                return await sectorMerriageService.updateSectorMerriage(
                    arg(parent, args, 'id'),
                    arg(parent, args, 'merriageRecord'),
                    sectorScope(context.user)
                );
            }),
        delete: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorMerriageRecord - delete', SERVICE, context, async () => {
                return await sectorMerriageService.deleteSectorMerriage(arg(parent, args, 'id'), sectorScope(context.user));
            }),
    },
};

export default resolversSectorMerriageRecord;
