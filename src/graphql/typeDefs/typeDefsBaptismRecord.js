const { gql } = require('apollo-server-express');

const dataTypesBaptismRecord = gql`
  type BaptismRecordQuery {
    getAll: [BaptismRecord]
    getByChildRut(childRut: ID!): BaptismRecord
    count: Int
  }
  type BaptismRecordMutation {
    create(baptismRecord: BaptismRecordInput!): Response
    update(baptismRecord: BaptismRecordInput): Response
    delete(childRut: ID!): Response
  }
  type BaptismRecord {
    childRut: ID!
    childFullName: String!
    childDateOfBirth: Date!
    fatherRut: ID
    fatherFullName: String
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
`;
module.exports = dataTypesBaptismRecord;
