const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { verifyToken } = require('./utils/auth');
const authRouter = require('./auth/auth.router');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const cors = require('cors');
const logger = require('./utils/logger');


require('dotenv').config();

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

app.use(express.json());
app.use('/auth', authRouter);

const authMiddleware = ({ req }) => {
  const authHeader = req.headers.authorization;
  //obtener ip
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  logger.logIpCosulta("Auth - Middleware",ip);

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token);
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      if (decoded.exp && decoded.exp < currentTime) {
        logger.logTokenExpirado("Auth - Middleware");
      }
      return { user: decoded };
    } catch (err) {
      logger.logTokenInvalid("Auth - Middleware",token)
    }
  }
  throw new Error('Authorization header must be provided');
};

app.use((req, res, next) => {
  next();
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  introspection: true,
});

server.start().then(() => {
  server.applyMiddleware({ app });
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Login endpoint at http://localhost:${PORT}/auth/login`);
  });
}).catch((error) => {
  console.error('Error starting the server: ', error);
});
