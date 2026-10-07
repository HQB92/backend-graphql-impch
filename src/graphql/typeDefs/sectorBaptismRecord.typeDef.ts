import { gql } from 'graphql-tag';

const dataTypesSectorBaptismRecord = gql`
  type SectorBaptismRecordQuery {
    getAll(sectorChurchId: ID): [SectorBaptismRecord]
    getById(id: ID!): SectorBaptismRecord
    count: Int
  }

  type SectorBaptismRecordMutation {
    create(baptismRecord: BaptismRecordInput!): Response
    update(id: ID!, baptismRecord: BaptismRecordInput!): Response
    delete(id: ID!): Response
  }

  type SectorBaptismRecord {
    id: ID!
    sectorChurchId: ID!
    sectorChurchName: String
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
`;

export default dataTypesSectorBaptismRecord;
