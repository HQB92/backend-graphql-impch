const { gql } = require('apollo-server-express');
const dataTypesUser = require('./typeDefs/user.typeDef');
const dataTypesIglesia = require('./typeDefs/church.typeDef');
const dataTypesMember = require('./typeDefs/member.typeDef');
const dataTypesStatus = require('./typeDefs/status.typeDef');
const datatypesBaptismRecord = require('./typeDefs/baptismRecord.typeDef');
const datatypesOffering = require('./typeDefs/offering.typeDef');


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
