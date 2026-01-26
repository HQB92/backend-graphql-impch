import MemberService from '../db/models/member.model';
import { Op } from 'sequelize';

interface MemberFilterArgs {
    churchId?: number;
    typeMember?: number;
}

interface MemberData {
    rut: string;
    names?: string;
    lastNameDad?: string;
    lastNameMom?: string;
    dateOfBirth?: Date;
    address?: string;
    telephone?: string;
    mobile?: string;
    email?: string;
    maritalStatus?: string;
    probationStartDate?: Date | null;
    fullMembershipDate?: Date | null;
    churchId?: number | null;
    statusId?: number | null;
    userId?: number | null;
    sexo?: string;
    isCorosUnidos?: boolean | null;
}

export interface ServiceResponse {
    code: number;
    message: string;
}

const getAllMembers = async (args: MemberFilterArgs): Promise<MemberService[]> => {
    let filterChurch: any = {};
    let filterType: any = {};

    if (args.churchId && args.churchId !== 0) {
        filterChurch = { churchId: args.churchId };
    }

    if (args.typeMember && args.typeMember !== 0) {
        if (args.typeMember === 1) {
            filterType = { probationStartDate: '2024-06-23 00:00:00+00', fullMembershipDate: null };
        }
        if (args.typeMember === 2) {
            filterType = {
                probationStartDate: { [Op.ne]: null },
                fullMembershipDate: { [Op.ne]: null }
            };
        }
        if (args.typeMember === 3) {
            filterType = {
                dateOfBirth: { [Op.gte]: new Date(new Date().setFullYear(new Date().getFullYear() - 13)) }
            };
        }
    }

    return await MemberService.findAll({ where: { ...filterChurch, ...filterType }, order: [['names', 'ASC']] });
};

const getMemberByRut = async (rut: string): Promise<MemberService | null> => {
    return await MemberService.findOne({ where: { rut } });
};

const getAllMemberProbation = async (): Promise<MemberService[]> => {
    return await MemberService.findAll({ where: { probationStartDate: '2024-06-23 00:00:00+00' } });
};

const countMembers = async (): Promise<number> => {
    return await MemberService.count();
};

const createMember = async (memberData: MemberData): Promise<ServiceResponse> => {
    const { rut } = memberData;
    const existingMember = await MemberService.findOne({ where: { rut } });
    if (existingMember) {
        return {
            code: 400,
            message: 'Miembro ya existe',
        };
    }
    try {
        // Si isCorosUnidos no se especifica, establecerlo en false por defecto
        const memberToCreate = {
            ...memberData,
            isCorosUnidos: memberData.isCorosUnidos !== undefined ? memberData.isCorosUnidos : false,
        };
        await MemberService.create(memberToCreate as any);
        return {
            code: 200,
            message: 'Miembro creado Exitosamente',
        };
    } catch (error) {
        return {
            code: 400,
            message: 'Error al crear miembro',
        };
    }
};

const updateMember = async (memberData: MemberData): Promise<ServiceResponse> => {
    const { rut } = memberData;
    const existingMember = await MemberService.findOne({ where: { rut } });
    if (!existingMember) {
        return {
            code: 400,
            message: 'Miembro no existe',
        };
    }
    try {
        await MemberService.update(memberData, { where: { rut } });
        return {
            code: 200,
            message: 'Miembro actualizado Exitosamente',
        };
    } catch (error) {
        return {
            code: 400,
            message: 'Error al actualizar miembro',
        };
    }
};

const deleteMember = async (rut: string): Promise<ServiceResponse> => {
    const result = await MemberService.findOne({ where: { rut } });
    if (!result) {
        return {
            code: 400,
            message: 'Miembro no existe',
        };
    }
    try {
        await MemberService.destroy({ where: { rut } });
        return {
            code: 200,
            message: 'Miembro eliminado Exitosamente',
        };
    } catch (error) {
        return {
            code: 400,
            message: 'Error al eliminar miembro',
        };
    }
};

export {
    getAllMembers,
    getMemberByRut,
    getAllMemberProbation,
    countMembers,
    createMember,
    updateMember,
    deleteMember,
};
