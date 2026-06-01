import { gql } from 'graphql-tag';

const dataTypesExpense = gql`
  type ExpenseQuery {
    getAll(churchId: Int, mes: Int, anio: Int, source: String): [Expense]
    getById(id: ID!): Expense
    getSummary(mes: Int!, anio: Int!, churchId: Int): [ExpenseSummary]
  }

  type ExpenseMutation {
    create(expense: ExpenseInput!): Response
    update(id: ID!, expense: ExpenseInput!): Response
    delete(id: ID!): Response
  }

  type Expense {
    id: ID
    amount: Int
    date: Date
    type: String
    description: String
    source: String
    churchId: ID
    userId: ID
  }

  input ExpenseInput {
    amount: Int
    date: Date
    type: String
    description: String
    source: String
    churchId: ID
    userId: ID
  }

  type ExpenseSummary {
    churchId: ID
    source: String
    total: Int
    count: Int
  }
`;

export default dataTypesExpense;
