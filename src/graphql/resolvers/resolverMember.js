const Member = require('../../models/member');

const resolversMember = {
  MemberQuery: {
    getAll: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      return Member.findAll();
    },
    getByRut: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      return await Member.findOne({ where: { rut: args.rut } });
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
      console.log(args.member);
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
      try {
        await Member.update(
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
        return {
          code: 200,
          message: 'Miembro actualizado Exitosamente',
        };
      } catch (e) {
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
