import { GraphQLJSON } from 'graphql-type-json';
import resolverUser from './resolvers/user.resolver';
import resolverChurch from './resolvers/church.resolver';
import resolverMember from './resolvers/member.resolver';
import resolverStatus from './resolvers/status.resolver';
import resolverBaptismRecord from './resolvers/baptismRecord.resolver';
import resolverOffering from './resolvers/offering.resolver';
import resolverMerriageRecord from './resolvers/merriageRecord.resolver';
import resolverBank from './resolvers/bank.resolver';
import resolverInventory from './resolvers/inventory.resolver';
import resolverRehearsal from './resolvers/rehearsal.resolver';
import resolverAttendance from './resolvers/attendance.resolver';

// Helper function to bind context to nested resolvers
const bindContextToResolvers = (resolverObject: any, context: any) => {
    const boundResolvers: any = {};
    for (const key in resolverObject) {
        const resolver = resolverObject[key];
        if (typeof resolver === 'function') {
            // Bind context to resolver function
            boundResolvers[key] = (parent: any, _args: any, _context: any) => {
                // Los argumentos reales de GraphQL están en _context.variableValues
                // Necesitamos obtener los argumentos reales de la query GraphQL
                const graphQLArgs = _context?.variableValues || {};
                // Combinar los argumentos de GraphQL con el contexto del usuario
                const combinedArgs = {
                    ...graphQLArgs,
                    user: context.user,
                };
                // Use the context from the parent resolver, not the GraphQL internal context
                return resolver(parent, combinedArgs, context);
            };
        } else {
            boundResolvers[key] = resolver;
        }
    }
    return boundResolvers;
};

const resolvers = {
    JSON: GraphQLJSON,
    Query: {
        User: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverUser.UserQuery, context);
        },
        Church: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverChurch.ChurchQuery, context);
        },
        Member: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverMember.MemberQuery, context);
        },
        Status: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverStatus.StatusQuery, context);
        },
        BaptismRecord: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverBaptismRecord.BaptismRecordQuery, context);
        },
        Offering: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverOffering.OfferingQuery, context);
        },
        MerriageRecord: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverMerriageRecord.MerriageRecordQuery, context);
        },
        Bank: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverBank.BankQuery, context);
        },
        Inventory: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverInventory.InventoryQuery, context);
        },
        Rehearsal: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverRehearsal.RehearsalQuery, context);
        },
        Attendance: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverAttendance.AttendanceQuery, context);
        },
    },
    Mutation: {
        User: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverUser.UserMutation, context);
        },
        Church: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverChurch.ChurchMutation, context);
        },
        Member: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverMember.MemberMutation, context);
        },
        Status: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverStatus.StatusMutation, context);
        },
        BaptismRecord: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverBaptismRecord.BaptismRecordMutation, context);
        },
        Offering: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverOffering.OfferingMutation, context);
        },
        MerriageRecord: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverMerriageRecord.MerriageRecordMutation, context);
        },
        Bank: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverBank.BankMutation, context);
        },
        Inventory: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverInventory.InventoryMutation, context);
        },
        Rehearsal: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverRehearsal.RehearsalMutation, context);
        },
        Attendance: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverAttendance.AttendanceMutation, context);
        },
    },
};

export default resolvers;
