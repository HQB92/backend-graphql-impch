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
      console.log('args', args);
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      const data = await Member.findOne({ where: { rut: args.rut } });
      console.log('data', data);
      return await Member.findOne({ where: { rut: args.rut } });
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
      } = args.member;
      console.log('args', args);
      const data = await Member.findOne({ where: { rut } });
      console.log('data', data);
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
        });
        return {
          code: 200,
          message: 'Miembro creado Exitosamente',
        };
      } catch (e) {
        console.log('e', e);
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
      } = args.member;
      try {
        await Member.update(
          {
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
        const response = await Member.destroy({ where: { id: args.id } });
        try {
          if (response === 0) {
            return {
              code: 400,
              message: 'Miembro no existe',
            };
          }
        } catch (e) {
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
        return {
          code: 500,
          message: 'Error al eliminar miembro',
        };
      }
    },
  },
};

module.exports = resolversMember;
