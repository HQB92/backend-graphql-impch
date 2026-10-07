import * as sectorBaptismService from '../../services/sectorBaptismRecord.service';
import { isSectorPastor, sectorScope } from '../../utils/tokensLogs';
import { GraphQLContext, GraphQLArgs } from '../types';
import { runSector, arg } from './sector.util';

const SERVICE = 'SectorBaptismRecord';

const resolversSectorBaptismRecord = {
    SectorBaptismRecordQuery: {
        getAll: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorBaptismRecord - getAll', SERVICE, context, async () => {
                const scopeId = sectorScope(context.user, arg(parent, args, 'sectorChurchId'));
                return await sectorBaptismService.getAllSectorBaptisms(scopeId);
            }),
        getById: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorBaptismRecord - getById', SERVICE, context, async () => {
                return await sectorBaptismService.getSectorBaptismById(arg(parent, args, 'id'), sectorScope(context.user));
            }),
        count: (_parent: any, _args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorBaptismRecord - count', SERVICE, context, async () => {
                return await sectorBaptismService.countSectorBaptisms(sectorScope(context.user));
            }),
    },

    SectorBaptismRecordMutation: {
        create: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorBaptismRecord - create', SERVICE, context, async () => {
                // Un registro siempre nace desde la cuenta de la iglesia.
                if (!isSectorPastor(context.user)) throw new Error('No autorizado');
                const sectorChurchId = sectorScope(context.user) as number;
                return await sectorBaptismService.createSectorBaptism(arg(parent, args, 'baptismRecord'), sectorChurchId);
            }),
        update: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorBaptismRecord - update', SERVICE, context, async () => {
                return await sectorBaptismService.updateSectorBaptism(
                    arg(parent, args, 'id'),
                    arg(parent, args, 'baptismRecord'),
                    sectorScope(context.user)
                );
            }),
        delete: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorBaptismRecord - delete', SERVICE, context, async () => {
                return await sectorBaptismService.deleteSectorBaptism(arg(parent, args, 'id'), sectorScope(context.user));
            }),
    },
};

export default resolversSectorBaptismRecord;
