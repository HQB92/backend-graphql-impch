const BaptismRecord = require('../../models/baptismRecord');

const resolversBaptismRecord = {
  BaptismRecordQuery: {
    getAll: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      return await BaptismRecord.findAll({ order: [['childFullName', 'ASC']] });
    },
    getByChildRut: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      return await BaptismRecord.findOne({ where: { childRut: args.childRut } });
    },
    count: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      return BaptismRecord.count();
    },
  },

  BaptismRecordMutation: {
    createBaptismRecord: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      const {
        childRut,
        childFullName,
        childDateOfBirth,
        fatherRut,
        fatherFullName,
        motherRut,
        motherFullName,
        placeOfRegistration,
        baptismDate,
        registrationNumber,
        registrationDate
      } = args.baptismRecord;

      const data = await BaptismRecord.findOne({ where: { childRut } });
      try {
        if (data) {
          return {
            success: false,
            message: 'Baptism record already exists',
          };
        }
        await BaptismRecord.create({
          childRut,
          childFullName,
          childDateOfBirth,
          fatherRut,
          fatherFullName,
          motherRut,
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
    updateBaptismRecord: async (args, context) => {
      if (!context.user) {
        throw new Error('You are not authenticated!');
      }
      const {
        childRut,
        childFullName,
        childDateOfBirth,
        fatherRut,
        fatherFullName,
        motherRut,
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
          fatherRut,
          fatherFullName,
          motherRut,
          motherFullName,
          placeOfRegistration,
          baptismDate,
          registrationNumber,
          registrationDate
        }, { where: { childRut } });
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
    deleteBaptismRecord: async (args, context) => {
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
