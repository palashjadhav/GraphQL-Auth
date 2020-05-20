const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLID
} = graphql;


const AdminType = new GraphQLObjectType({
    name: 'AdminType',
    fields: () => ({
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        mobile: { type: GraphQLInt },
        name: { type: GraphQLString },
        resetToken: { type: GraphQLString },
    })
});
module.exports = AdminType;