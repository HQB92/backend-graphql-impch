const { gql } = require('apollo-server-express');
const { dataTypesUser,
        dataTypesIglesia,
        dataTypesMember,
        dataTypesStatus,
        datatypesBaptismRecord,
			  datatypesOffering}  = require('./typeDefs/index');

const typeDefs = gql`
    scalar Date
    ${dataTypesUser}
    ${dataTypesIglesia}
    ${dataTypesMember}
    ${dataTypesStatus}
    ${datatypesBaptismRecord}
    ${datatypesOffering}
    
    type Query {
        User: UserQuery
        Church: ChurchQuery
        Member: MemberQuery
        Status: StatusQuery
        BaptismRecord: BaptismRecordQuery
        Offering: OfferingQuery
    }
    
    type Mutation {
        User: UserMutation
        Church: ChurchMutation
        Member: MemberMutation
        Status: StatusMutation
        BaptismRecord: BaptismRecordMutation
        Offering: OfferingMutation
    }
    
    type Response {
        code: Int
        message: String
    }
`;

module.exports = typeDefs;
