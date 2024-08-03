import  { gql } from 'apollo-server-express';

const dataTypesBaptismRecord = gql`
  type BaptismRecordQuery {
    getAll: [BaptismRecord]
    getByChildRut(childRUT: ID!): BaptismRecord
    count: Int
  }
  
  type BaptismRecordMutation {
    create(baptismRecord: BaptismRecordInput!): Response
    update(baptismRecord: BaptismRecordInput): Response
    delete(childRUT: ID!): Response
  }
  
  type BaptismRecord {
    childRUT: ID!
    childFullName: String!
    childDateOfBirth: Date!
    fatherRUT: ID
    fatherFullName: String
    motherRUT: ID!
    motherFullName: String!
    placeOfRegistration: String!
    baptismDate: Date!
    registrationNumber: String!
    registrationDate: Date!
  }

  input BaptismRecordInput {
    childRUT: ID
    childFullName: String
    childDateOfBirth: Date
    fatherRUT: ID
    fatherFullName: String
    motherRUT: ID
    motherFullName: String
    placeOfRegistration: String
    baptismDate: Date
    registrationNumber: String
    registrationDate: Date
  }
`;
export default dataTypesBaptismRecord;
