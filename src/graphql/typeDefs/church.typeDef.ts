import { gql } from 'apollo-server-express';

const dataTypesChurch = gql`
  type ChurchQuery {
    getAll: [Church]
    getById(id: ID!): Church
    getByName(name: String!): Church
  }
  type ChurchMutation {
    create(name: String!, address: String!): Response
    update(id: ID!, name: String, address: String): Response
    delete(id: ID!): Response
  }
  type Church {
    id: ID
    name: String
    address: String
  }
`;
export default dataTypesChurch;
