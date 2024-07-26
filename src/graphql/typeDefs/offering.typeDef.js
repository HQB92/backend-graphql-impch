const { gql } = require('apollo-server-express');

const dataTypesOffering = gql`
  type holle{
    id: ID!
    name: String!
    address: String
  }
  

  `;
module.exports = dataTypesOffering;
