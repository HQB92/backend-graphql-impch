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
        husbandRUT: ID!
        husbandFullName: String!
        wifeRUT: ID!
        wifeFullName: String!
        placeOfRegistration: String!
        merriageDate: Date!
        registrationNumber: String!
        registrationDate: Date!
    }
    
    input MerriageRecordInput {
        husbandRUT: ID
        husbandFullName: String
        wifeRUT: ID
        wifeFullName: String
        placeOfRegistration: String
        merriageDate: Date
        registrationNumber: String
        registrationDate: Date
    }
`;

module.exports = dataTypesMerriageRecord