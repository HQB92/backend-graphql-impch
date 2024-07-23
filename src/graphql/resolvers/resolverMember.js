const memberService = require('../../services/member');
const { validateContext } = require('../../utils/validateContext');


const resolversMember = {
  MemberQuery: {
    getAll: async (args, context) => {
      console.log('getAll - Inicio:', new Date().toISOString());
      console.log('getAll - Args:', args);
      validateContext(context.user);

      const members = await memberService.getAllMembers(args);
      console.log('getAll - Respuesta:', members);
      console.log('getAll - Fin:', new Date().toISOString());
      return members;
    },
    getByRut: async (args, context) => {
      console.log('getByRut - Inicio:', new Date().toISOString());
      console.log('getByRut - Args:', args);

      validateContext(context.user);

      const member = await memberService.getMemberByRut(args.rut);
      console.log('getByRut - Respuesta:', member.dataValues);
      console.log('getByRut - Fin:', new Date().toISOString());
      return member;
    },
    count: async (args, context) => {
      console.log('count - Inicio:', new Date().toISOString());

      validateContext(context.user);

      const count = await memberService.countMembers();
      console.log('count - Respuesta:', count);
      console.log('count - Fin:', new Date().toISOString());
      return count;
    },
  },

  MemberMutation: {
    create: async (args, context) => {
      console.log('create - Inicio:', new Date().toISOString());
      console.log('create - Args:', args);

      validateContext(context.user);

      const response = await memberService.createMember(args.member);
      console.log('create - Respuesta:', response.dataValues);
      console.log('create - Fin:', new Date().toISOString());
      return response;
    },
    update: async (args, context) => {
      console.log('update - Inicio:', new Date().toISOString());
      console.log('update - Args:', args);

      validateContext(context.user);

      const response = await memberService.updateMember(args.member);
      console.log('update - Respuesta:', response.dataValues);
      console.log('update - Fin:', new Date().toISOString());
      return response;
    },
    delete: async (args, context) => {
      console.log('delete - Inicio:', new Date().toISOString());
      console.log('delete - Args:', args);

      validateContext(context.user);

      const response = await memberService.deleteMember(args.rut);
      console.log('delete - Respuesta:', response.dataValues);
      console.log('delete - Fin:', new Date().toISOString());
      return response;
    },
  },
};

module.exports = resolversMember;
