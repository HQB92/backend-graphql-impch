const { gql } = require('apollo-server-express');
const { dataTypesUser,
        dataTypesIglesia,
        dataTypesMember,
        dataTypesStatus,
        datatypesBaptismRecord}  = require('./typeDefs/index');

const typeDefs = gql`
    scalar Date
    ${dataTypesUser}
    ${dataTypesIglesia}
    ${dataTypesMember}
    ${dataTypesStatus}
    ${datatypesBaptismRecord}
    
    type Query {
        User: UserQuery
        Church: ChurchQuery
        Member: MemberQuery
        Status: StatusQuery
        BaptismRecord: BaptismRecordQuery
    }
    
    type Mutation {
        User: UserMutation
        Church: ChurchMutation
        Member: MemberMutation
        Status: StatusMutation
        BaptismRecord: BaptismRecordMutation
    }
    
    type Response {
        code: Int
        message: String
    }
`;

module.exports = typeDefs;
