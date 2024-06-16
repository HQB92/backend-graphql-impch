const {resolverUser, resolverChurch, resolverMember, resolverStatus} = require("./resolvers/index");

const resolvers = {
    Query: {
        User: (_,parent, args, context) => ({
            ...resolverUser.UserQuery
        }),
        Church: (_,parent, args, context) => ({
            ...resolverChurch.ChurchQuery
        }),
        Member: (_,parent, args, context) => ({
            ...resolverMember.MemberQuery
        }),
        Status: (_,parent, args, context) => ({
            ...resolverStatus.StatusQuery
        }),
    },
    Mutation: {
        User: (parent, args, context) => ({
            ...resolverUser.UserMutation
        }),
        Church: (parent, args, context) => ({
            ...resolverChurch.ChurchMutation
        }),
        Member: (parent, args, context) => ({
            ...resolverMember.MemberMutation
        }),
        Status: (parent, args, context) => ({
            ...resolverStatus.StatusMutation
        }),
    },
};

module.exports = resolvers;
