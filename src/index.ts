import express, { Request, Response, NextFunction } from 'express';
import { ApolloServer, HeaderMap } from '@apollo/server';
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
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/auth', authRouter);

interface GraphQLContext {
    user?: TokenPayload;
}

const authMiddleware = async ({ req }: { req: Request }): Promise<GraphQLContext> => {
    const authHeaderRaw = req.headers.authorization || req.headers.Authorization;
    const authHeader = Array.isArray(authHeaderRaw) ? authHeaderRaw[0] : authHeaderRaw;

    const ip = Array.isArray(req.headers['x-forwarded-for'])
        ? req.headers['x-forwarded-for'][0]
        : (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown') as string;
    logger.logIpCosulta("Auth - Middleware", ip);

    if (authHeader && typeof authHeader === 'string') {
        const firstAuthValue = authHeader.split(',')[0].trim();
        const token = firstAuthValue.startsWith('Bearer ')
            ? firstAuthValue.split(' ')[1]
            : firstAuthValue;

        if (!token) {
            return { user: undefined };
        }

        try {
            const decoded = verifyToken(token);
            return { user: decoded };
        } catch (err: any) {
            logger.logTokenInvalid("Auth - Middleware", token);
            return { user: undefined };
        }
    }
    return { user: undefined };
};

const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
});

server.start().then(() => {
    app.use('/graphql', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
                httpGraphQLRequest: {
                    method: req.method.toUpperCase(),
                    headers: new HeaderMap(
                        Object.entries(req.headers).map(([key, value]) => [
                            key,
                            Array.isArray(value) ? value.join(', ') : (value ?? ''),
                        ])
                    ),
                    body: { kind: 'parsed', parsedBody: req.body ?? {} },
                    search: req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '',
                },
                context: () => authMiddleware({ req }),
            });

            for (const [key, value] of httpGraphQLResponse.headers) {
                res.setHeader(key, value);
            }
            res.status(httpGraphQLResponse.status ?? 200);

            if (httpGraphQLResponse.body.kind === 'complete') {
                res.send(httpGraphQLResponse.body.string);
            } else {
                for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
                    res.write(chunk);
                }
                res.end();
            }
        } catch (err) {
            next(err);
        }
    });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
        console.log(`🚀 Login endpoint at http://localhost:${PORT}/auth/login`);
    });
}).catch((error) => {
    console.error('Error starting the server: ', error);
});
