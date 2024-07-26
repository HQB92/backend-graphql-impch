
const {validateContext} = require('../../utils/tokensLogs');
const logger = require('../../utils/logger');
const resolversOffering = {
  query: {
    hallo: async (args, context) => {
      return {
        message: 'Hallo, World!'
      }
    }
  }
}
module.exports = resolversOffering;