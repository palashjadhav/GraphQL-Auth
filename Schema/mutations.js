const graphql = require('graphql');
const AdminType = require('./Admin_type');
const TokenType = require('./Token_type');
const Auth = require('../Controllers/AdminAuth');
const Admin = require('../Models/Admin');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLError
} = graphql;

const mutations = new GraphQLObjectType({
    name: 'mutation',
    fields: {
        signup: {
            type: AdminType,
            args: {
                email: { type: GraphQLString },
                mobileno: { type: GraphQLString },
                name: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parentValue, { email, password, mobileno, name }, context, info) {
                const mobile = parseInt(mobileno);
                console.log(context);
                console.log(info);
                return Admin.create({ email, password, mobile, name });
            }
        },
        login: {
            type: TokenType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parentValue, args, context) {
                const { email, password } = args;
                return Auth.loginAdmin(email, password, context.res)
                    .then(user => {
                        return user;
                    })
                    .catch(new GraphQLError("invalid"));
            }
        },
        logout: {
            type: AdminType,
            resolve(parentValue, args, req) {

                return user;
            }
        },
        forgotPassword: {
            type: AdminType,
            args: {
                email: { type: GraphQLString }
            },
            resolve(parentValue, args, context) {
                return Auth.forgotPassword(args.email)
                    .then(resetToken => {
                        //send email to admin to give token
                        console.log(resetToken);
                        return { email: args.email };
                    })
            }
        },
        resetPassword: {
            type: AdminType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                resetToken: { type: GraphQLString }
            },
            resolve(parentValue, { email, password, resetToken }, context) {
                return Auth.resetPassword(email, resetToken, password)
                    .catch(new Error({ message: "Invalid" }));
            }
        },
        getMe: {
            type: AdminType,
            resolve(parentValue, args, context) {
                return Auth.protect(context.req)
                    .then((isValid) => {
                        if (!isValid) {
                            return new GraphQLError("Not Authorize");
                        }
                        return { email: "a@gsdf" };
                    })
            }

        }
    }
});

module.exports = mutations;