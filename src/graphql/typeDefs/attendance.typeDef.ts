import { gql } from 'apollo-server-express';

const dataTypesAttendance = gql`
  type AttendanceQuery {
    getByRehearsal(rehearsalId: ID!): [Attendance]
    getMemberStats(memberRut: ID!): MemberAttendanceStats
  }
  type AttendanceMutation {
    register(rehearsalId: ID!, memberRut: ID!): Response
    delete(rehearsalId: ID!, memberRut: ID!): Response
  }
  type Attendance {
    id: ID!
    rehearsalId: ID!
    memberRut: ID!
    attendedAt: Date!
    member: Member
    rehearsal: Rehearsal
    createdAt: Date
    updatedAt: Date
  }

  type MemberAttendanceStats {
    totalRehearsals: Int!
    attendedRehearsals: Int!
    attendancePercentage: Float!
  }
`;

export default dataTypesAttendance;
