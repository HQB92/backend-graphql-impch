import moment from 'moment-timezone';

const dateFormated = (): string => {
    return moment().tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss');
}

interface Logger {
    logStart: (operation: string) => void;
    logEnd: (operation: string) => void;
    logArgs: (operation: string, args: any) => void;
    logResponse: (operation: string, response: any) => void;
    logResponses: (operation: string, responses: any[]) => void;
    logError: (operation: string, error: any) => void;
    logUser: (operation: string, user: any) => void;
    logAuthUsername: (operation: string, username: string) => void;
    logAuthPassword: (operation: string, password: string) => void;
    logToken: (operation: string, token: string) => void;
    logErrorCors: (operation: string, error: any) => void;
    logTokenInvalid: (operation: string, token?: string) => void;
    logTokenExpirado: (operation: string) => void;
    logIpCosulta: (operation: string, ip: string) => void;
}

const logger: Logger = {
    logStart: (operation: string) => {
        console.log(`${operation} - Inicio:`, dateFormated());
    },
    logEnd: (operation: string) => {
        console.log(`${operation} - Fin:`, dateFormated());
    },
    logArgs: (operation: string, args: any) => {
        console.log(`${operation} - Args:`, args);
    },
    logResponse: (operation: string, response: any) => {
        console.log(`${operation} - Respuesta:`, response?.dataValues ? response.dataValues : response.length);
    },
    logResponses: (operation: string, responses: any[]) => {
        console.log(`${operation} - Cantidad de Respuestas:`, responses.length);
    },
    logError: (operation: string, error: any) => {
        console.error(`${operation} - Error:`, error);
    },
    logUser: (operation: string, user: any) => {
        console.log(`${operation} - User:`, user?.username || user?.name || 'No user');
    },
    logAuthUsername: (operation: string, username: string) => {
        console.log(`${operation} - Username:`, username);
    },
    logAuthPassword: (operation: string, _password: string) => {
        console.log(`${operation} - Password: ************`);
    },
    logToken: (operation: string, token: string) => {
        console.log(`${operation} - Token:`, token.substring(0, 20) + '...');
    },
    logErrorCors: (operation: string, error: any) => {
        console.error(`${operation} - Error:`, error);
    },
    logTokenInvalid: (operation: string, _token?: string) => {
        console.error(`${operation} - Token inválido`);
    },
    logTokenExpirado: (operation: string) => {
        console.error(`${operation} - Token Expirado`);
    },
    logIpCosulta: (operation: string, ip: string) => {
        console.log(`${operation} - IP:`, ip);
    }
};

export default logger;
