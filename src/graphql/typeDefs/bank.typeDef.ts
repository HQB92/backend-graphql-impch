import { gql } from 'apollo-server-express';

const dataTypesBank = gql`
  type BankQuery {
    getAll(churchId: Int, mes: Int, anio: Int): [Bank]
    getById(id: ID!): Bank
    getSummary(mes: Int!, anio: Int!): [BankSummary]
  }
  
  type BankMutation {
    create(bank: BankInput!): Response
    update(id: ID!, bank: BankInput!): Response
    delete(id: ID!): Response
  }
  
  type Bank {
    id: ID
    amount: Int
    date: Date
    type: String
    churchId: ID
    userId: ID
    state: Boolean
    comment: String
  }
  
  input BankInput {
    amount: Int
    date: Date
    type: String
    churchId: ID
    userId: ID
    state: Boolean
    comment: String
  }
  
  type BankSummary {
    churchId: ID
    total: Int
    count: Int
  }
`;

export default dataTypesBank;
