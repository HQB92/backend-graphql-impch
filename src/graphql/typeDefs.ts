import { gql } from 'apollo-server-express';
import dataTypesUser from './typeDefs/user.typeDef';
import dataTypesIglesia from './typeDefs/church.typeDef';
import dataTypesMember from './typeDefs/member.typeDef';
import dataTypesStatus from './typeDefs/status.typeDef';
import datatypesBaptismRecord from './typeDefs/baptismRecord.typeDef';
import datatypesOffering from './typeDefs/offering.typeDef';
import dataTypesMerriageRecord from './typeDefs/merriageRecord.typeDef';
import dataTypesBank from './typeDefs/bank.typeDef';

const typeDefs = gql`
    scalar Date
    scalar JSON
    ${dataTypesUser}
    ${dataTypesIglesia}
    ${dataTypesMember}
    ${dataTypesStatus}
    ${datatypesBaptismRecord}
    ${datatypesOffering}
    ${dataTypesMerriageRecord}
    ${dataTypesBank}
    
    type Query {
        User: UserQuery
        Church: ChurchQuery
        Member: MemberQuery
        Status: StatusQuery
        BaptismRecord: BaptismRecordQuery
        Offering: OfferingQuery
        MerriageRecord: MerriageRecordQuery
        Bank: BankQuery
    }
    
    type Mutation {
        User: UserMutation
        Church: ChurchMutation
        Member: MemberMutation
        Status: StatusMutation
        BaptismRecord: BaptismRecordMutation
        Offering: OfferingMutation
        MerriageRecord: MerriageRecordMutation
        Bank: BankMutation
    }
    
    type Response {
        code: Int!
        message: String!
        data: JSON
    }
    
    
`;

export default typeDefs;
