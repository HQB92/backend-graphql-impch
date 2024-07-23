const memberService = require('../../services/member');
const validateContext = require('../../utils/validateContext');

const resolversMember = {
  MemberQuery: {
    getAll: async (args, context) => {
      console.log('Member - getAll - Inicio:', new Date().toISOString());
      console.log('Member - getAll - User:', context.user);
      console.log('Member - getAll - Args:', args);
      validateContext(context.user, "Member");
      const members = await memberService.getAllMembers(args);
      console.log('Member - getAll - Respuesta:', members);
      console.log('Member - getAll - Fin:', new Date().toISOString());
      return members;
    },
    getByRut: async (args, context) => {
      console.log('Member - getByRut - Inicio:', new Date().toISOString());
      console.log('Member - getByRut - User:', context.user);
      console.log('Member - getByRut - Args:', args);
      validateContext(context.user, "Member");
      const member = await memberService.getMemberByRut(args.rut);
      console.log('Member - getByRut - Respuesta:', member.dataValues);
      console.log('Member - getByRut - Fin:', new Date().toISOString());
      return member;
    },
    count: async (args, context) => {
      console.log('Member - count - Inicio:', new Date().toISOString());
      console.log('Member - getAll - User:', context.user);
      console.log('Member - count - Args:', args);
      validateContext(context.user, "Member");
      const count = await memberService.countMembers();
      console.log('Member - count - Respuesta:', count);
      console.log('Member - count - Fin:', new Date().toISOString());
      return count;
    },
  },

  MemberMutation: {
    create: async (args, context) => {
      console.log('Member - create - Inicio:', new Date().toISOString());
      console.log('Member - create - User:', context.user);
      console.log('Member - create - Args:', args);
      validateContext(context.user, "Member");
      const response = await memberService.createMember(args.member);
      console.log('Member - create - Respuesta:', response.dataValues);
      console.log('Member - create - Fin:', new Date().toISOString());
      return response;
    },
    update: async (args, context) => {
      console.log('Member - update - Inicio:', new Date().toISOString());
      console.log('Member - update - User:', context.user);
      console.log('Member - update - Args:', args);
      validateContext(context.user, "Member");
      const response = await memberService.updateMember(args.member);
      console.log('Member - update - Respuesta:', response.dataValues);
      console.log('Member - update - Fin:', new Date().toISOString());
      return response;
    },
    delete: async (args, context) => {
      console.log('Member - delete - Inicio:', new Date().toISOString());
      console.log('Member - delete - User:', context.user);
      console.log('Member - delete - Args:', args);
      validateContext(context.user, "Member");
      const response = await memberService.deleteMember(args.rut);
      console.log('Member - delete - Respuesta:', response.dataValues);
      console.log('Member - delete - Fin:', new Date().toISOString());
      return response;
    },
  },
};

module.exports = resolversMember;