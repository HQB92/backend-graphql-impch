const { gql } = require('apollo-server-express');

const dataTypesStatus = gql`
  
  type StatusQuery {
    getAll: [Status]
    getById(id: ID!): Status
  }
  type StatusMutation {
    create(name: String!, description: String!): Response
    update(id: ID!, name: String, description: String): Response
    delete(id: ID!): Response
  }
  type Status {
    id: ID
    name: String
    description: String
  }
  `;
module.exports = dataTypesStatus;
