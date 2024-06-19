const Church = require('../../models/church');

const resolversChurch = {
  ChurchQuery: {
    getAll: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      return Church.findAll();
    },
    getById: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      const data = await Iglesia.findOne({ where: { id: args?.id } });
      return await Church.findOne({ where: { id: args.id } });
    },
    getByName: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      return Church.findOne({ where: { nombre: args.nombre } });
    },
  },

  ChurchMutation: {
    create: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      const { name, address } = args;
      const data = await Church.findOne({ where: { name } });
      try {
        if (data) {
          return {
            code: 400,
            message: 'Iglesia ya existe',
          };
        }
        await Church.create({ name, address });
        return {
          code: 200,
          message: 'Iglesia creada Exitosamente',
        };
      } catch (e) {
        return {
          code: 500,
          message: 'Error al crear iglesia',
        };
      }
    },
    update: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      const { id, nombre, direccion } = args;
      try {
        await Church.update({ nombre, direccion }, { where: { id } });
        return {
          code: 200,
          message: 'Iglesia actualizada Exitosamente',
        };
      } catch (e) {
        return {
          code: 500,
          message: 'Error al actualizar iglesia',
        };
      }
    },
    delete: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      try {
        const response = await Church.destroy({ where: { id: args.id } });
        try {
          if (response === 0) {
            return {
              code: 400,
              message: 'Iglesia no existe',
            };
          }
        } catch (e) {
          return {
            code: 500,
            message: 'Error al eliminar iglesia',
          };
        }
        return {
          code: 200,
          message: 'Iglesia eliminada Exitosamente',
        };
      } catch (e) {
        return {
          code: 500,
          message: 'Error al eliminar iglesia',
        };
      }
    },
  },
};

module.exports = resolversChurch;
