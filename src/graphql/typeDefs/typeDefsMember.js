const { gql } = require('apollo-server-express');

const dataTypesMember = gql`
  type MemberQuery {
    getAll: [Member]
    getByRut(rut: ID!): Member
    GetAllMemberProbation: [Member]
    count: Int
  }
  type MemberMutation {
    create(member: MemberInput!): Response
    update(member: MemberInput): Response
    delete(rut: String!): Response
  }
  type Member {
    rut: ID!
    names: String!
    lastNameDad: String!
    lastNameMom: String!
    dateOfBirth: Date!
    address: String!
    telephone: String
    mobile: String!
    email: String
    maritalStatus: String!
    probationStartDate: Date
    fullMembershipDate: Date
    churchId: ID!
    statusId: String!
    userId: ID
    sexo: String
  }

  input MemberInput {
    rut: ID
    names: String
    lastNameDad: String
    lastNameMom: String
    dateOfBirth: Date
    address: String
    telephone: String
    mobile: String
    email: String
    maritalStatus: String
    probationStartDate: Date
    fullMembershipDate: Date
    churchId: ID
    statusId: ID
    userId: ID
    sexo: String
  }
`;
module.exports = dataTypesMember;
