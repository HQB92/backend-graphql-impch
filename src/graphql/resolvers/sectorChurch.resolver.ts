import * as sectorChurchService from '../../services/sectorChurch.service';
import { isAdmin, isSectorPastor, sectorScope } from '../../utils/tokensLogs';
import { GraphQLContext, GraphQLArgs } from '../types';
import { runSector, arg } from './sector.util';

const SERVICE = 'SectorChurch';

// El perfil y la clave son siempre los de la iglesia del token.
const ownChurchId = (user: any): number => {
    if (!isSectorPastor(user)) throw new Error('No autorizado');
    return sectorScope(user) as number;
};

const resolversSectorChurch = {
    SectorChurchQuery: {
        getAll: (_parent: any, _args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorChurch - getAll', SERVICE, context, async () => {
                if (isSectorPastor(context.user) || !isAdmin(context.user)) throw new Error('No autorizado');
                return await sectorChurchService.getAllSectorChurches();
            }),
        me: (_parent: any, _args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorChurch - me', SERVICE, context, async () => {
                return await sectorChurchService.getSectorChurchById(ownChurchId(context.user));
            }),
    },

    SectorChurchMutation: {
        updateProfile: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorChurch - updateProfile', SERVICE, context, async () => {
                return await sectorChurchService.updateSectorChurchProfile(ownChurchId(context.user), {
                    pastor: arg(parent, args, 'pastor'),
                    address: arg(parent, args, 'address'),
                    phone: arg(parent, args, 'phone'),
                });
            }),
        changePassword: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorChurch - changePassword', SERVICE, context, async () => {
                return await sectorChurchService.changeSectorChurchPassword(
                    ownChurchId(context.user),
                    arg(parent, args, 'currentPassword'),
                    arg(parent, args, 'newPassword')
                );
            }),
    },
};

export default resolversSectorChurch;
