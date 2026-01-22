import { gql } from 'apollo-server-express';

const dataTypesMerriageRecord = gql`
    type MerriageRecordQuery {
        getAll: [MerriageRecord]
        count: Int
    }
    
    type MerriageRecordMutation {
        create(merriageRecord: MerriageRecordInput!): Response
        #update(merriageRecord: MerriageRecordInput): Response
        #delete(id: ID!): Response
    }
    
    type MerriageRecord {
        id: ID!
        husbandId: ID!
        fullNameHusband: String!
        wifeId: ID!
        fullNameWife: String!
        civilCode: Int!
        civilDate: Date!
        civilPlace: String!
        religiousDate: Date!
    }
    
    input MerriageRecordInput {
        husbandId: ID
        fullNameHusband: String
        wifeId: ID
        fullNameWife: String
        civilCode: Int
        civilDate: Date
        civilPlace: String
        religiousDate: Date
    }
`;

export default dataTypesMerriageRecord;
