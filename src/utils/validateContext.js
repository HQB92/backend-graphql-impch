
const validateContext = (user, patchService) => {
  if (!user) {
    console.log(patchService,' - getAll - Error: You are not authenticated!');
    console.log(patchService,' - getAll - Fin:', new Date().toISOString());
    throw new Error('You are not authenticated!');
  }
};

module.exports = validateContext;