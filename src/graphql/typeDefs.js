const { gql } = require('apollo-server-express');
const {dataTypesUser,
       dataTypesIglesia,
       dataTypesMember,
       dataTypesStatus}  = require('./typeDefs/index');

const typeDefs = gql`
    scalar Date
    ${dataTypesUser}
    ${dataTypesIglesia}
    ${dataTypesMember}
    ${dataTypesStatus}
    
    type Query {
        User: UserQuery
        Church: ChurchQuery
        Member: MemberQuery
        Status: StatusQuery
    }
    
    type Mutation {
        User: UserMutation
        Church: ChurchMutation
        Member: MemberMutation
        Status: StatusMutation
    }
    
    type Response {
        code: Int
        message: String
    }
`;

module.exports = typeDefs;
