const { gql } = require('apollo-server-express');

const dataTypesBaptismRecord = gql`
  type BaptismRecordQuery {
    getAllBaptismRecords: [BaptismRecord]
    getBaptismRecordByChildRut(childRut: ID!): BaptismRecord
    countBaptismRecords: Int
  }
  type BaptismRecordMutation {
    createBaptismRecord(baptismRecord: BaptismRecordInput!): Response
    updateBaptismRecord(baptismRecord: BaptismRecordInput): Response
    deleteBaptismRecord(childRut: ID!): Response
  }
  type BaptismRecord {
    childRut: ID!
    childFullName: String!
    childDateOfBirth: Date!
    fatherRut: ID!
    fatherFullName: String!
    motherRut: ID!
    motherFullName: String!
    placeOfRegistration: String!
    baptismDate: Date!
    registrationNumber: String!
    registrationDate: Date!
  }

  input BaptismRecordInput {
    childRut: ID
    childFullName: String
    childDateOfBirth: Date
    fatherRut: ID
    fatherFullName: String
    motherRut: ID
    motherFullName: String
    placeOfRegistration: String
    baptismDate: Date
    registrationNumber: String
    registrationDate: Date
  }

  type Response {
    success: Boolean!
    message: String
  }
`;
module.exports = dataTypesBaptismRecord;
