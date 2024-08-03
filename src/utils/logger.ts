import moment from 'moment-timezone';
import userType from '../types/userType';

const dateFormated = () => {
    return moment().tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss');
}


const logger = {
    logStart: (operation: string) => {
        console.log(`${operation} - Inicio:`, dateFormated());
    },
    logEnd: (operation: string) => {
        console.log(`${operation} - Fin:`, dateFormated());
    },
    logArgs: (operation: string, args: object) => {
        console.log(`${operation} - Args:`, args);
    },
    logResponse: (operation: string, response: any) => {
        console.log(`${operation} - Respuesta:`, response?.dataValues ? response.dataValues : response.length);
    },
    logResponses: (operation: string, responses: any) => {
        console.log(`${operation} - Cantidad de Respuestas:`, responses.length);
    },
    logError: (operation: string, error: any) => {
        console.error(`${operation} - Error:`, error);
    },
    logUser: (operation: string, user: userType) => {
        console.log(`${operation} - User:`, user.username);
    },
    logAuthUsername: (operation: string, username: string) => {
        console.log(`${operation} - Username:`, username);
    },
    logAuthPassword: (operation: string, password: string) => {
        console.log(`${operation} - Password: ************`);
    },
    logToken: (operation: string, token: string) => {
        console.log(`${operation} - Token:`, token);
    },
    logErrorCors: (operation: string, error: any) => {
        console.error(`${operation} - Error:`, error);
    },
    logTokenInvalid: (operation: string, token: string) => {
        console.error(`${operation} - Token inválido - Token:`, token);
    },
    logTokenExpirado: (operation: string) => {
        console.error(`${operation} - Token Expirado`);
    },
    logIpCosulta: (operation: string, ip: any) => {
        console.log(`${operation} - IP:`, ip);
    }


};

export {logger}
