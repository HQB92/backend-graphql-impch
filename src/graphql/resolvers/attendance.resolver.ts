import * as attendanceService from '../../services/attendance.service';
import { validateContext } from '../../utils/tokensLogs';
import logger from '../../utils/logger';
import { GraphQLContext, GraphQLArgs } from '../types';

const resolversAttendance = {
    AttendanceQuery: {
        getByRehearsal: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Attendance - getByRehearsal');
            logger.logUser('Attendance - getByRehearsal', context.user);
            logger.logArgs('Attendance - getByRehearsal', args);
            validateContext(context.user, 'Attendance');
            try {
                const attendances = await attendanceService.getAttendanceByRehearsal(Number(args.rehearsalId!));
                logger.logResponses('Attendance - getByRehearsal', attendances);
                return attendances;
            } catch (error) {
                logger.logError('Attendance - getByRehearsal', error);
                throw error;
            } finally {
                logger.logEnd('Attendance - getByRehearsal');
            }
        },
        getMemberStats: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Attendance - getMemberStats');
            logger.logUser('Attendance - getMemberStats', context.user);
            logger.logArgs('Attendance - getMemberStats', args);
            validateContext(context.user, 'Attendance');
            try {
                const stats = await attendanceService.getMemberAttendanceStats(args.memberRut as string);
                logger.logResponse('Attendance - getMemberStats', stats);
                return stats;
            } catch (error) {
                logger.logError('Attendance - getMemberStats', error);
                throw error;
            } finally {
                logger.logEnd('Attendance - getMemberStats');
            }
        },
    },

    AttendanceMutation: {
        register: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Attendance - register');
            logger.logUser('Attendance - register', context.user);
            logger.logArgs('Attendance - register', args);
            validateContext(context.user, 'Attendance');
            try {
                const response = await attendanceService.registerAttendance({
                    rehearsalId: Number(args.rehearsalId!),
                    memberRut: args.memberRut as string,
                });
                logger.logResponse('Attendance - register', response);
                return response;
            } catch (error) {
                logger.logError('Attendance - register', error);
                throw error;
            } finally {
                logger.logEnd('Attendance - register');
            }
        },
        delete: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Attendance - delete');
            logger.logUser('Attendance - delete', context.user);
            logger.logArgs('Attendance - delete', args);
            validateContext(context.user, 'Attendance');
            try {
                const response = await attendanceService.deleteAttendance(
                    Number(args.rehearsalId!),
                    args.memberRut as string
                );
                logger.logResponse('Attendance - delete', response);
                return response;
            } catch (error) {
                logger.logError('Attendance - delete', error);
                throw error;
            } finally {
                logger.logEnd('Attendance - delete');
            }
        },
    },
};

export default resolversAttendance;
