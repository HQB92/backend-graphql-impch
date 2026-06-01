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

app.use('/auth', express.json({ limit: '10mb' }));
app.use('/auth', express.urlencoded({ extended: true, limit: '10mb' }));
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

app.use((err: Error, _req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400 && 'body' in err) {
        res.status(400).json({ error: 'Invalid JSON in request body' });
        return;
    }
    if (err && err.message && err.message.includes('stream is not readable')) {
        res.status(400).json({ error: 'Request body already consumed' });
        return;
    }
    next(err);
});

const readRawBody = (req: Request): Promise<string> =>
    new Promise((resolve, reject) => {
        if (req.method === 'GET' || req.method === 'HEAD') return resolve('');
        let data = '';
        req.on('data', (chunk: Buffer) => { data += chunk.toString('utf-8'); });
        req.on('end', () => resolve(data));
        req.on('error', reject);
    });

server.start().then(() => {
    app.use('/graphql', async (req: Request, res: Response) => {
        const rawBody = await readRawBody(req);
        const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
            httpGraphQLRequest: {
                method: req.method.toUpperCase(),
                headers: new HeaderMap(
                    Object.entries(req.headers).map(([key, value]) => [
                        key,
                        Array.isArray(value) ? value.join(', ') : (value ?? ''),
                    ])
                ),
                body: rawBody
                    ? { kind: 'raw', rawBody }
                    : { kind: 'parsed', parsedBody: {} },
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
    });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
        console.log(`🚀 Login endpoint at http://localhost:${PORT}/auth/login`);
    });
}).catch((error) => {
    console.error('Error starting the server: ', error);
});
