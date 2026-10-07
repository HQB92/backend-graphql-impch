import { gql } from 'graphql-tag';
import dataTypesUser from './typeDefs/user.typeDef';
import dataTypesIglesia from './typeDefs/church.typeDef';
import dataTypesMember from './typeDefs/member.typeDef';
import dataTypesStatus from './typeDefs/status.typeDef';
import datatypesBaptismRecord from './typeDefs/baptismRecord.typeDef';
import datatypesOffering from './typeDefs/offering.typeDef';
import dataTypesMerriageRecord from './typeDefs/merriageRecord.typeDef';
import dataTypesBank from './typeDefs/bank.typeDef';
import dataTypesInventory from './typeDefs/inventory.typeDef';
import dataTypesRehearsal from './typeDefs/rehearsal.typeDef';
import dataTypesAttendance from './typeDefs/attendance.typeDef';
import dataTypesExpense from './typeDefs/expense.typeDef';
import dataTypesSectorChurch from './typeDefs/sectorChurch.typeDef';
import dataTypesSectorBaptismRecord from './typeDefs/sectorBaptismRecord.typeDef';

const typeDefs = gql`
    scalar Date
    scalar JSON
    ${dataTypesUser}
    ${dataTypesIglesia}
    ${dataTypesMember}
    ${dataTypesStatus}
    ${datatypesBaptismRecord}
    ${datatypesOffering}
    ${dataTypesMerriageRecord}
    ${dataTypesBank}
    ${dataTypesInventory}
    ${dataTypesRehearsal}
    ${dataTypesAttendance}
    ${dataTypesExpense}
    ${dataTypesSectorChurch}
    ${dataTypesSectorBaptismRecord}

    type Query {
        User: UserQuery
        Church: ChurchQuery
        Member: MemberQuery
        Status: StatusQuery
        BaptismRecord: BaptismRecordQuery
        Offering: OfferingQuery
        MerriageRecord: MerriageRecordQuery
        Bank: BankQuery
        Inventory: InventoryQuery
        Rehearsal: RehearsalQuery
        Attendance: AttendanceQuery
        Expense: ExpenseQuery
        SectorChurch: SectorChurchQuery
        SectorBaptismRecord: SectorBaptismRecordQuery
    }
    
    type Mutation {
        User: UserMutation
        Church: ChurchMutation
        Member: MemberMutation
        Status: StatusMutation
        BaptismRecord: BaptismRecordMutation
        Offering: OfferingMutation
        MerriageRecord: MerriageRecordMutation
        Bank: BankMutation
        Inventory: InventoryMutation
        Rehearsal: RehearsalMutation
        Attendance: AttendanceMutation
        Expense: ExpenseMutation
        SectorChurch: SectorChurchMutation
        SectorBaptismRecord: SectorBaptismRecordMutation
    }
    
    type Response {
        code: Int!
        message: String!
        data: JSON
    }
    
    
`;

export default typeDefs;
