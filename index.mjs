import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { mongoose } from 'mongoose';

import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers/index.js';
import { mongoConnect } from './mongoConfig.js';

const server = await new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },
});

mongoose.connect(mongoConnect.MONGODB, { useNewUrlParser: true }).then(() => {
    console.log('MongoDB connected');
    console.log(`Server ready at: ${url}`);
});
