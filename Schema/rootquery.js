const graphql = require('graphql');
const {
    GraphQLObjectType,

} = graphql;
const Admintype = require('./Admin_type');

const RootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        Admin: {
            type: Admintype,
            resolve(parentValue, args, req) {
                return null;
            }
        }
    })
});
module.exports = RootQueryType;