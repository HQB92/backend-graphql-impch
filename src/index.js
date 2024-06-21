const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { verifyToken } = require('./auth/auth');
const authRouter = require('./auth/auth.router');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const cors = require('cors');


require('dotenv').config();

const app = express();

// Habilitar CORS para todas las solicitudes
app.use(cors());

app.use(express.json());
app.use('/auth', authRouter);

const authMiddleware = ({ req }) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    if (decoded.exp && decoded.exp < currentTime) {
      throw new Error('Token expirado');
    }
    return { user: decoded };
  }
  throw new Error('Authorization header must be provided');
};

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
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(`🚀 Login endpoint at http://localhost:${PORT}/auth/login`);
  });
});
