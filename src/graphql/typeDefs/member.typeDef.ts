import { gql } from 'apollo-server-express';

const dataTypesMember = gql`
  type MemberQuery {
    getAll(churchId: Int , typeMember: Int): [Member]
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
    isCorosUnidos: Boolean
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
    isCorosUnidos: Boolean
  }
`;

export default dataTypesMember;
