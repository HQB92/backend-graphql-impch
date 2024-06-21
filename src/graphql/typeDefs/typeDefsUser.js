const { gql } = require('apollo-server-express');

const dataTypesUser = gql`
  
  type UserQuery {
    getAll: [User]
    getById(id: ID!): User
    getByUsername(username: String!): User
  }
  type UserMutation {
    create(username: String!, email: String!, password: String! rut:ID!): Response
    update(id: ID!, username: String, email: String, password:String, rut:ID! ): Response
    delete(id: ID!): Response
    changePassword(id: ID!, password: String!): Response
    
  }
  type User {
    id: ID
    rut: ID
    username: String
    email: String
  }
  `;
module.exports = dataTypesUser;
