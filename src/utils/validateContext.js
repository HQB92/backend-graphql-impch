
const validateContext = (user) => {
  if (!user) {
    console.log('getAll - Error: You are not authenticated!');
    console.log('getAll - Fin:', new Date().toISOString());
    throw new Error('You are not authenticated!');
  }
};

module.exports = validateContext;