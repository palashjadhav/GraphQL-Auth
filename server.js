const express = require('express');
const dotenv = require('dotenv');
const expressGraphQL = require('express-graphql');
const connectDB = require('./Config/ConnectDB');
const schema = require('./schema/schema');

dotenv.config({ path: './Config/config.env' });
connectDB();

const app = express();
app.use('/graphql', expressGraphQL((req, res) => ({
    schema,
    graphiql: process.env.NODE_ENV === "development",
    context: { req, res }
})));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});