const { gql } = require('apollo-server-express');

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
        husbandFullName: String!
        wifeId: ID!
        wifeFullName: String!
        placeOfRegistration: String!
        merriageDate: Date!
        registrationNumber: String!
        registrationDate: Date!
    }
    
    input MerriageRecordInput {
        husbandId: ID
        husbandFullName: String
        wifeId: ID
        wifeFullName: String
        placeOfRegistration: String
        merriageDate: Date
        registrationNumber: String
        registrationDate: Date
    }
`;

module.exports = dataTypesMerriageRecord