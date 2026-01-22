import express, { Request, Response, NextFunction } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { verifyToken } from './utils/auth';
import type { TokenPayload } from './utils/auth';
import authRouter from './auth/auth.router';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import cors from 'cors';
import logger from './utils/logger';
import 'dotenv/config';

const app = express();

const allowedOrigins = [
    'https://impchzanartu.cl',
    'https://api.impchzanartu.cl',
    'http://impchzanartu.cl',
    'http://api.impchzanartu.cl',
    'http://localhost:4000',
    'http://localhost:3000',
    'https://localhost:4000',
    'https://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            console.log("CORS permitido desde: ", origin);
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rutas REST con body-parser específico
app.use('/auth', express.json({ limit: '10mb' }));
app.use('/auth', express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/auth', authRouter);

interface GraphQLContext {
    user?: TokenPayload;
}

const authMiddleware = async ({ req }: { req: Request }): Promise<GraphQLContext> => {
    // Obtener el header de autorización (puede ser string o string[])
    const authHeaderRaw = req.headers.authorization || req.headers.Authorization;
    const authHeader = Array.isArray(authHeaderRaw) ? authHeaderRaw[0] : authHeaderRaw;
    
    const ip = Array.isArray(req.headers['x-forwarded-for']) 
        ? req.headers['x-forwarded-for'][0] 
        : (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown') as string;
    logger.logIpCosulta("Auth - Middleware", ip);

    console.log('[Auth Middleware] Authorization header:', authHeader ? 'Present' : 'Missing');
    console.log('[Auth Middleware] Header keys:', Object.keys(req.headers));
    console.log('[Auth Middleware] authorization:', req.headers.authorization);
    console.log('[Auth Middleware] Authorization:', req.headers.Authorization);

    if (authHeader && typeof authHeader === 'string') {
        // El header puede contener múltiples valores separados por coma, tomar solo el primero
        const firstAuthValue = authHeader.split(',')[0].trim();
        
        // Manejar tanto "Bearer token" como solo "token"
        const token = firstAuthValue.startsWith('Bearer ') 
            ? firstAuthValue.split(' ')[1] 
            : firstAuthValue;
        
        console.log('[Auth Middleware] Token extracted:', token ? `${token.substring(0, 20)}...` : 'No token');
        console.log('[Auth Middleware] Full token length:', token ? token.length : 0);
        
        if (!token) {
            console.log('[Auth Middleware] No token found after parsing');
            return { user: undefined };
        }
        
        try {
            const decoded = verifyToken(token);
            console.log('[Auth Middleware] Token decoded successfully, user:', decoded.username);
            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp < currentTime) {
                logger.logTokenExpirado("Auth - Middleware");
                console.log('[Auth Middleware] Token expired, returning undefined user');
                return { user: undefined };
            }
            console.log('[Auth Middleware] Returning context with user:', decoded.username);
            const contextToReturn = { user: decoded };
            console.log('[Auth Middleware] Context object:', JSON.stringify(contextToReturn, null, 2));
            return contextToReturn;
        } catch (err: any) {
            console.error('[Auth Middleware] Error verifying token:', err.message || err);
            console.error('[Auth Middleware] Token preview:', token.substring(0, 50) + '...');
            logger.logTokenInvalid("Auth - Middleware", token);
            // No lanzar error, solo retornar sin usuario
            return { user: undefined };
        }
    }
    console.log('[Auth Middleware] No authorization header, returning undefined user');
    return { user: undefined };
};

app.use((_req: Request, _res: Response, next: NextFunction) => {
    next();
});

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
    introspection: true,
});

// Middleware para manejar errores de body-parser
app.use((err: Error, _req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
        res.status(400).json({ error: 'Invalid JSON in request body' });
        return;
    }
    if (err && err.message && err.message.includes('stream is not readable')) {
        res.status(400).json({ error: 'Request body already consumed' });
        return;
    }
    next(err);
});

server.start().then(() => {
    server.applyMiddleware({
        app: app as any,
        path: '/graphql',
        cors: false
    });
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`🚀 Login endpoint at http://localhost:${PORT}/auth/login`);
    });
}).catch((error) => {
    console.error('Error starting the server: ', error);
});
