import { GraphQLJSON } from 'graphql-type-json';
import resolverUser from './resolvers/user.resolver';
import resolverChurch from './resolvers/church.resolver';
import resolverMember from './resolvers/member.resolver';
import resolverStatus from './resolvers/status.resolver';
import resolverBaptismRecord from './resolvers/baptismRecord.resolver';
import resolverOffering from './resolvers/offering.resolver';
import resolverMerriageRecord from './resolvers/merriageRecord.resolver';
import resolverBank from './resolvers/bank.resolver';

// Helper function to bind context to nested resolvers
const bindContextToResolvers = (resolverObject: any, context: any) => {
    const boundResolvers: any = {};
    for (const key in resolverObject) {
        const resolver = resolverObject[key];
        if (typeof resolver === 'function') {
            // Bind context to resolver function
            boundResolvers[key] = (parent: any, args: any, _context: any) => {
                // Use the context from the parent resolver, not the GraphQL internal context
                return resolver(parent, args, context);
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
    },
};

export default resolvers;
