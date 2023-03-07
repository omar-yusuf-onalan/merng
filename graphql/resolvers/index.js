const postsResolvers = require('./posts');
const usersResolvers = require('./users');

exports.resolvers = {
    Query: {
        ...postsResolvers.Query,
        ...usersResolvers.Query,
    },
    Mutation: {
        ...usersResolvers.Mutation,
    },
};
