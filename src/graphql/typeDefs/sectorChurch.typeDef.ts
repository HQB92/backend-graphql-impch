import { gql } from 'graphql-tag';

const dataTypesSectorChurch = gql`
  type SectorChurchQuery {
    getAll: [SectorChurch]
    me: SectorChurch
  }

  type SectorChurchMutation {
    updateProfile(pastor: String, address: String, phone: String): Response
    changePassword(currentPassword: String!, newPassword: String!): Response
  }

  type SectorChurch {
    id: ID!
    name: String!
    pastor: String
    address: String
    phone: String
  }
`;

export default dataTypesSectorChurch;
