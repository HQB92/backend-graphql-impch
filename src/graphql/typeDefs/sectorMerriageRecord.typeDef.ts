import { gql } from 'graphql-tag';

const dataTypesSectorMerriageRecord = gql`
  type SectorMerriageRecordQuery {
    getAll(sectorChurchId: ID): [SectorMerriageRecord]
    getById(id: ID!): SectorMerriageRecord
    count: Int
  }

  type SectorMerriageRecordMutation {
    create(merriageRecord: MerriageRecordInput!): Response
    update(id: ID!, merriageRecord: MerriageRecordInput!): Response
    delete(id: ID!): Response
  }

  type SectorMerriageRecord {
    id: ID!
    sectorChurchId: ID!
    sectorChurchName: String
    husbandId: ID!
    fullNameHusband: String!
    wifeId: ID!
    fullNameWife: String!
    civilCode: Int!
    civilDate: Date!
    civilPlace: String!
    religiousDate: Date!
  }
`;

export default dataTypesSectorMerriageRecord;
