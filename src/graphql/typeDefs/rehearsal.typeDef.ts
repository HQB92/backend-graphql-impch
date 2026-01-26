import { gql } from 'apollo-server-express';

const dataTypesRehearsal = gql`
  type RehearsalQuery {
    getAll: [Rehearsal]
    getById(id: ID!): Rehearsal
    getAttendanceStats(rehearsalId: ID!): AttendanceStats
  }
  type RehearsalMutation {
    create(rehearsal: RehearsalInput!): Response
    update(rehearsal: RehearsalInput!): Response
    delete(id: ID!): Response
  }
  type Rehearsal {
    id: ID!
    date: Date!
    description: String
    churchId: ID
    church: Church
    attendances: [Attendance]
    createdAt: Date
    updatedAt: Date
  }

  input RehearsalInput {
    id: ID
    date: Date!
    description: String
    churchId: ID
  }

  type AttendanceStats {
    totalMembers: Int!
    attendedMembers: Int!
    attendancePercentage: Float!
  }
`;

export default dataTypesRehearsal;
