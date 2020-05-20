const graphql = require('graphql');
const { GraphQLSchema } = graphql;

const RootQueryType = require('./rootquery');
const mutations = require('./mutations');

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: mutations
});