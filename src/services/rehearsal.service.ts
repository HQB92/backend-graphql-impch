import Rehearsal from '../db/models/rehearsal.model';
import Attendance from '../db/models/attendance.model';
import Member from '../db/models/member.model';
import Church from '../db/models/church.model';

interface RehearsalData {
    id?: number;
    date?: Date;
    description?: string | null;
    churchId?: number | null;
}

export interface ServiceResponse {
    code: number;
    message: string;
    data?: any;
}

const getAllRehearsals = async (): Promise<Rehearsal[]> => {
    return await Rehearsal.findAll({
        order: [['date', 'DESC']],
        include: [
            {
                model: Church,
                as: 'church',
                attributes: ['id', 'name', 'address'],
            },
            {
                model: Attendance,
                as: 'attendances',
                include: [
                    {
                        model: Member,
                        as: 'member',
                        attributes: ['rut', 'names', 'lastNameDad', 'lastNameMom'],
                    },
                ],
            },
        ],
    });
};

const getRehearsalById = async (id: number): Promise<Rehearsal | null> => {
    return await Rehearsal.findByPk(id, {
        include: [
            {
                model: Church,
                as: 'church',
                attributes: ['id', 'name', 'address'],
            },
            {
                model: Attendance,
                as: 'attendances',
                include: [
                    {
                        model: Member,
                        as: 'member',
                        attributes: ['rut', 'names', 'lastNameDad', 'lastNameMom'],
                    },
                ],
            },
        ],
    });
};

const createRehearsal = async (rehearsalData: RehearsalData): Promise<ServiceResponse> => {
    if (!rehearsalData.date) {
        return {
            code: 400,
            message: 'La fecha es requerida',
        };
    }

    try {
        const rehearsal = await Rehearsal.create({
            date: rehearsalData.date,
            description: rehearsalData.description || null,
            churchId: rehearsalData.churchId || null,
        } as any);
        return {
            code: 200,
            message: 'Repaso creado exitosamente',
            data: rehearsal,
        };
    } catch (error: any) {
        return {
            code: 400,
            message: `Error al crear repaso: ${error.message}`,
        };
    }
};

const updateRehearsal = async (rehearsalData: RehearsalData): Promise<ServiceResponse> => {
    const { id } = rehearsalData;
    if (!id) {
        return {
            code: 400,
            message: 'ID de repaso es requerido',
        };
    }

    const existingRehearsal = await Rehearsal.findByPk(id);
    if (!existingRehearsal) {
        return {
            code: 400,
            message: 'Repaso no existe',
        };
    }

    try {
        // Construir objeto de actualización solo con campos definidos
        const updateData: any = {};
        if (rehearsalData.date !== undefined) updateData.date = rehearsalData.date;
        if (rehearsalData.description !== undefined) updateData.description = rehearsalData.description;
        if (rehearsalData.churchId !== undefined) updateData.churchId = rehearsalData.churchId;

        await Rehearsal.update(updateData, { where: { id } });
        return {
            code: 200,
            message: 'Repaso actualizado exitosamente',
        };
    } catch (error: any) {
        return {
            code: 400,
            message: `Error al actualizar repaso: ${error.message}`,
        };
    }
};

const deleteRehearsal = async (id: number): Promise<ServiceResponse> => {
    const existingRehearsal = await Rehearsal.findByPk(id);
    if (!existingRehearsal) {
        return {
            code: 400,
            message: 'Repaso no existe',
        };
    }

    try {
        await Rehearsal.destroy({ where: { id } });
        return {
            code: 200,
            message: 'Repaso eliminado exitosamente',
        };
    } catch (error: any) {
        return {
            code: 400,
            message: `Error al eliminar repaso: ${error.message}`,
        };
    }
};

const getRehearsalAttendanceStats = async (rehearsalId: number): Promise<{ totalMembers: number; attendedMembers: number; attendancePercentage: number }> => {
    const rehearsal = await Rehearsal.findByPk(rehearsalId, {
        include: [
            {
                model: Attendance,
                as: 'attendances',
            },
        ],
    }) as any;

    if (!rehearsal) {
        throw new Error('Repaso no encontrado');
    }

    // Contar solo los coristas de Coros Unidos
    const totalMembers = await Member.count({
        where: {
            isCorosUnidos: true
        }
    });
    const attendedMembers = rehearsal.attendances?.length || 0;
    const attendancePercentage = totalMembers > 0 ? (attendedMembers / totalMembers) * 100 : 0;

    return {
        totalMembers,
        attendedMembers,
        attendancePercentage: Math.round(attendancePercentage * 100) / 100,
    };
};

export {
    getAllRehearsals,
    getRehearsalById,
    createRehearsal,
    updateRehearsal,
    deleteRehearsal,
    getRehearsalAttendanceStats,
};
