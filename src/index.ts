import express, { Express, Request, Response, NextFunction } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { verifyToken } from './utils/auth';
import authRouter from './auth/auth.router';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import cors from 'cors';
import { logger } from './utils/logger';

require('dotenv').config();

const app: Express = express();

// Habilitar CORS para dominios específicos
const allowedOrigins = ['http://localhost:3000', 'http://localhost:4000', 'https://impchzanartu.online', "https://app.impchzanartu.online", "https://studio.apollographql.com"];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            logger.logErrorCors("CORS Error", origin);
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(express.json());
app.use('/auth', authRouter);

const authMiddleware = ({ req }: { req: Request }) => {
    const authHeader = req.headers.authorization;
    const ip = req.headers['x-forwarded-for'];
    logger.logIpCosulta("Auth - Middleware", ip);

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded: any = verifyToken(token);
            const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
            if (decoded.exp && decoded.exp < currentTime) {
                logger.logTokenExpirado("Auth - Middleware");
            }
            return { user: decoded };
        } catch (err) {
            logger.logTokenInvalid("Auth - Middleware", token);
        }
    }
    throw new Error('Authorization header must be provided');
};

app.use((req: Request, res: Response, next: NextFunction) => {
    next();
});

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
    introspection: true,
});

server.start().then(() => {
    // @ts-ignore
    server.applyMiddleware({ app });
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`🚀 Login endpoint at http://localhost:${PORT}/auth/login`);
    });
}).catch((error) => {
    console.error('Error starting the server: ', error);
});
