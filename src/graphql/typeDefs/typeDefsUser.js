const { gql } = require('apollo-server-express');

const dataTypesUser = gql`
  
  type UserQuery {
    getAll: [User]
    getById(id: ID!): User
    getByUsername(username: String!): User
  }
  type UserMutation {
    create(user: UserInput!): Response
    update(user: UserInput!): Response
    delete(id: ID!): Response
    changePassword(id: ID!, password: String!): Response
    resetPassword(id: ID!): Response
    
  }
  type User {
    id: ID
    rut: ID
    username: String
    email: String
    roles: [String]
  }
  
  input UserInput {
    rut: ID
    username: String
    email: String
    password: String
    roles: [String]
  }
  `;
module.exports = dataTypesUser;
