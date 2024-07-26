// src/service/memberService.js
const MemberService = require('../db/models/member.model');
const { Op } = require('sequelize');

const getAllMembers = async (args) => {

    let filterChurch = {};
    let filterType = {};

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

const getMemberByRut = async (rut) => {
    return await MemberService.findOne({ where: { rut } });
};

const getAllMemberProbation = async () => {
    return await MemberService.findAll({ where: { probationStartDate: '2024-06-23 00:00:00+00' } });
};

const countMembers = async () => {
    return await MemberService.count();
};

const createMember = async (memberData) => {
    const { rut } = memberData;
    const existingMember = await MemberService.findOne({ where: { rut } });
    if (existingMember) {
        return {
            code: 400,
            message: 'Miembro ya existe',
        };
    }
    try {
        await MemberService.create(memberData);
        return {
            code: 200,
            message: 'Miembro creado Exitosamente',
        };
    }catch (error) {
        return {
            code: 400,
            message: 'Error al crear miembro',
        };
    }
};

const updateMember = async (memberData, ) => {
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

const deleteMember = async (rut) => {
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

module.exports = {
    getAllMembers,
    getMemberByRut,
    getAllMemberProbation,
    countMembers,
    createMember,
    updateMember,
    deleteMember,
};
