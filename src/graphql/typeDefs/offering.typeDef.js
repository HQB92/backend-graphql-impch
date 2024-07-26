const { gql } = require('apollo-server-express');

const dataTypesOffering = gql`
  type holle{
    message: String
  }
  

  `;
module.exports = dataTypesOffering;
