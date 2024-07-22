const BaptismRecord = require('../../models/baptismRecord');

const resolversBaptismRecord = {
  BaptismRecordQuery: {
    getAll: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      return await BaptismRecord.findAll({ order: [['baptismDate', 'ASC']] });
    },
    getByChildRut: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      return await BaptismRecord.findOne({ where: { childRut: args.childRUT } });
    },
    count: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      return BaptismRecord.count();
    },
  },

  BaptismRecordMutation: {
    create: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      const {
        childRUT,
        childFullName,
        childDateOfBirth,
        fatherRUT,
        fatherFullName,
        motherRUT,
        motherFullName,
        placeOfRegistration,
        baptismDate,
        registrationNumber,
        registrationDate
      } = args.baptismRecord;

      const data = await BaptismRecord.findOne({ where: { childRUT } });
      try {
        if (data) {
          return {
            success: false,
            message: 'Baptism record already exists',
          };
        }
        await BaptismRecord.create({
          childRUT,
          childFullName,
          childDateOfBirth,
          fatherRUT,
          fatherFullName,
          motherRUT,
          motherFullName,
          placeOfRegistration,
          baptismDate,
          registrationNumber,
          registrationDate
        });
        return {
          success: true,
          message: 'Baptism record created successfully',
        };
      } catch (e) {
        console.log('Error', e);
        return {
          success: false,
          message: 'Error creating baptism record',
        };
      }
    },
    update: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      const {
        childRUT,
        childFullName,
        childDateOfBirth,
        fatherRUT,
        fatherFullName,
        motherRUT,
        motherFullName,
        placeOfRegistration,
        baptismDate,
        registrationNumber,
        registrationDate
      } = args.baptismRecord;
      try {
        const response = await BaptismRecord.update({
          childFullName,
          childDateOfBirth,
          fatherRUT,
          fatherFullName,
          motherRUT,
          motherFullName,
          placeOfRegistration,
          baptismDate,
          registrationNumber,
          registrationDate
        }, { where: { childRUT } });
        return {
          success: true,
          message: 'Baptism record updated successfully',
        };
      } catch (e) {
        console.log('Error', e);
        return {
          success: false,
          message: 'Error updating baptism record',
        };
      }
    },
    delete: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      try {
        const response = await BaptismRecord.destroy({ where: { childRut: args.childRut } });
        if (response === 0) {
          return {
            success: false,
            message: 'Baptism record does not exist',
          };
        }
        return {
          success: true,
          message: 'Baptism record deleted successfully',
        };
      } catch (e) {
        console.log('Error', e);
        return {
          success: false,
          message: 'Error deleting baptism record',
        };
      }
    },
  },
};

module.exports = resolversBaptismRecord;
