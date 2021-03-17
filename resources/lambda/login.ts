import { Context, APIGatewayEvent } from "aws-lambda";
const jwt = require("jsonwebtoken");

exports.handler = async function (event: APIGatewayEvent, context: Context) {
    const signedToken = jwt.sign({
        iex: 'oo7',
        givenName: 'Bames Gond'
    }, process.env.JWT_SECRET!);

    return {
        body: JSON.stringify(signedToken),
        statusCode: 200
    };
}