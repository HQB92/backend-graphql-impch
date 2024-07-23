const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { verifyToken } = require('./auth/auth');
const authRouter = require('./auth/auth.router');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const cors = require('cors');

require('dotenv').config();

const app = express();

// Habilitar CORS para dominios específicos
const allowedOrigins = ['http://localhost:3000', 'http://localhost:4000', 'https://impchzanartu.online' ];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());
app.use('/auth', authRouter);

const authMiddleware = ({ req }) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token);
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      if (decoded.exp && decoded.exp < currentTime) {
        throw new Error('Token expirado');
      }
      return { user: decoded };
    } catch (err) {
      throw new Error('Invalid/Expired token');
    }
  }
  throw new Error('Authorization header must be provided');
};

app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
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
