import Attendance from '../db/models/attendance.model';
import Rehearsal from '../db/models/rehearsal.model';
import Member from '../db/models/member.model';

interface AttendanceData {
    rehearsalId: number;
    memberRut: string;
}

export interface ServiceResponse {
    code: number;
    message: string;
    data?: any;
}

const registerAttendance = async (attendanceData: AttendanceData): Promise<ServiceResponse> => {
    const { rehearsalId, memberRut } = attendanceData;

    // Verificar que el repaso existe
    const rehearsal = await Rehearsal.findByPk(rehearsalId);
    if (!rehearsal) {
        return {
            code: 400,
            message: 'Repaso no existe',
        };
    }

    // Verificar que el miembro existe
    const member = await Member.findByPk(memberRut);
    if (!member) {
        return {
            code: 400,
            message: 'Miembro no existe',
        };
    }

    // Verificar si ya existe la asistencia
    const existingAttendance = await Attendance.findOne({
        where: {
            rehearsalId,
            memberRut,
        },
    });

    if (existingAttendance) {
        return {
            code: 400,
            message: 'La asistencia ya está registrada',
        };
    }

    try {
        const attendance = await Attendance.create({
            rehearsalId,
            memberRut,
            attendedAt: new Date(),
        } as any);

        return {
            code: 200,
            message: 'Asistencia registrada exitosamente',
            data: attendance,
        };
    } catch (error: any) {
        return {
            code: 400,
            message: `Error al registrar asistencia: ${error.message}`,
        };
    }
};

const getAttendanceByRehearsal = async (rehearsalId: number): Promise<Attendance[]> => {
    return await Attendance.findAll({
        where: { rehearsalId },
        include: [
            {
                model: Member,
                as: 'member',
                attributes: ['rut', 'names', 'lastNameDad', 'lastNameMom'],
            },
        ],
        order: [['attendedAt', 'DESC']],
    });
};

const deleteAttendance = async (rehearsalId: number, memberRut: string): Promise<ServiceResponse> => {
    const attendance = await Attendance.findOne({
        where: {
            rehearsalId,
            memberRut,
        },
    });

    if (!attendance) {
        return {
            code: 400,
            message: 'Asistencia no encontrada',
        };
    }

    try {
        await Attendance.destroy({
            where: {
                rehearsalId,
                memberRut,
            },
        });

        return {
            code: 200,
            message: 'Asistencia eliminada exitosamente',
        };
    } catch (error: any) {
        return {
            code: 400,
            message: `Error al eliminar asistencia: ${error.message}`,
        };
    }
};

const getMemberAttendanceStats = async (memberRut: string): Promise<{ totalRehearsals: number; attendedRehearsals: number; attendancePercentage: number }> => {
    const totalRehearsals = await Rehearsal.count();
    const attendedRehearsals = await Attendance.count({
        where: { memberRut },
    });

    const attendancePercentage = totalRehearsals > 0 ? (attendedRehearsals / totalRehearsals) * 100 : 0;

    return {
        totalRehearsals,
        attendedRehearsals,
        attendancePercentage: Math.round(attendancePercentage * 100) / 100,
    };
};

export {
    registerAttendance,
    getAttendanceByRehearsal,
    deleteAttendance,
    getMemberAttendanceStats,
};
