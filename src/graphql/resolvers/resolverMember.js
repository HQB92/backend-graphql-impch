const Member = require('../../models/member');
const {Op} = require("sequelize");

const resolversMember = {
  MemberQuery: {
    getAll: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
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
        return await Member.findAll({ where: { ...filterChurch, ...filterType }, order: [['names', 'ASC']] });
    },
    getByRut: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      return await Member.findOne({ where: { rut: args.rut } });
    },
    GetAllMemberProbation: async (args, context) => {
        if (!context.user) {
            throw new Error('You are not authenticated!');
        }
        return Member.findAll({ where: { probationStartDate:'2024-06-23 00:00:00+00' } });
    },
    count: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      return Member.count();
    },
  },

  MemberMutation: {
    create: async (args, context) => {

      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      const {
        rut,
        names,
        lastNameDad,
        lastNameMom,
        dateOfBirth,
        address,
        telephone,
        mobile,
        email,
        maritalStatus,
        probationStartDate,
        fullMembershipDate,
        churchId,
        statusId,
        userId,
        sexo,
      } = args.member;
      const data = await Member.findOne({ where: { rut } });
      try {
        if (data) {
          return {
            code: 400,
            message: 'Miembro ya existe',
          };
        }
        await Member.create({
          rut,
          names,
          lastNameDad,
          lastNameMom,
          dateOfBirth,
          address,
          telephone,
          mobile,
          email,
          maritalStatus,
          probationStartDate,
          fullMembershipDate,
          churchId,
          statusId,
          userId,
          sexo,
        });
        return {
          code: 200,
          message: 'Miembro creado Exitosamente',
        };
      } catch (e) {
        console.log('errro', e);
        return {
          code: 500,
          message: 'Error al crear miembro',
        };
      }
    },
    update: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      const {
        rut,
        names,
        lastNameDad,
        lastNameMom,
        dateOfBirth,
        address,
        telephone,
        mobile,
        email,
        maritalStatus,
        probationStartDate,
        fullMembershipDate,
        churchId,
        statusId,
        userId,
        sexo,
      } = args.member;
      console.log(args.member);
      try {
        const response =await Member.update(
          {
            names,
            lastNameDad,
            lastNameMom,
            dateOfBirth,
            address,
            telephone,
            mobile,
            email,
            maritalStatus,
            probationStartDate,
            fullMembershipDate,
            churchId,
            statusId,
            userId,
            sexo,
          },
          { where: { rut: rut } }
        );
        console.log('response', response);
        return {
          code: 200,
          message: 'Miembro actualizado Exitosamente',
        };
      } catch (e) {
        console.log('errro', e);
        return {
          code: 500,
          message: 'Error al actualizar miembro',
        };
      }
    },
    delete: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      try {
        const response = await Member.destroy({ where: { rut: args.rut } });
        try {
          if (response === 0) {
            return {
              code: 400,
              message: 'Miembro no existe',
            };
          }
        } catch (e) {
          console.log('errror 1', e);
          return {
            code: 500,
            message: 'Error al eliminar miembro',
          };
        }
        return {
          code: 200,
          message: 'Miembro eliminado Exitosamente',
        };
      } catch (e) {
        console.log('errror 2', e);
        return {
          code: 500,
          message: 'Error al eliminar miembro',
        };
      }
    },
  },
};

module.exports = resolversMember;
