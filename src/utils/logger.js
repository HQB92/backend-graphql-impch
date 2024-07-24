const moment = require('moment-timezone');


const dateFormated = () => {
    return moment().tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss');
}

const logger = {
    logStart: (operation) => {
        console.log(`${operation} - Inicio:`, dateFormated());
    },
    logEnd: (operation) => {
        console.log(`${operation} - Fin:`, dateFormated());
    },
    logArgs: (operation, args) => {
        console.log(`${operation} - Args:`, args);
    },
    logResponse: (operation, response) => {
        console.log(`${operation} - Respuesta:`, response?.dataValues);
    },
    logResponses: (operation, responses) => {
        responses.forEach((response, index) => {
            console.log(`${operation} - Respuesta[${index}]:`, response?.dataValues);
        });
    },
    logError: (operation, error) => {
        console.error(`${operation} - Error:`, error);
    },
    logUser: (operation, user) => {
        console.log(`${operation} - User:`, user.username);
    },
    logAuthUsername: (operation, username) => {
        console.log(`${operation} - Username:`, username);
    },
    logAuthPassword: (operation, password) => {
        console.log(`${operation} - Password: ************`);
    },
    logToken: (operation, token) => {
        console.log(`${operation} - Token:`, token);
    },
};

module.exports = logger;
