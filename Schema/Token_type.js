const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString
} = graphql;

const TokenType = new GraphQLObjectType({
    name: 'Token',
    fields: {
        jwt: {
            type: GraphQLString
        },
        id: {
            type: GraphQLID
        }
    }
});
module.exports = TokenType;
