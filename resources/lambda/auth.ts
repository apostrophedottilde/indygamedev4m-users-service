const jwt = require("jsonwebtoken");

exports.handler = async function (event: any, context: any, callback: any) {
    console.log(event)
    console.log(context)
    const tkn = event.headers["Authentication"]

    const decodedToken = jwt.verify(tkn, process.env.JWT_SECRET!);
    if (decodedToken) {
        callback(null, generatePolicy(decodedToken, 'user', 'Allow', event.methodArn));
    } else {
        callback(null, generatePolicy(null, 'user', 'Deny', event.methodArn));
    }

    function generatePolicy(token: any, principalId: string, effect: any, resource: any) {
        var authResponse: any = {};

        authResponse.principalId = principalId;
        if (effect && resource) {
            var policyDocument: any = {};
            policyDocument.Version = '2012-10-17';
            policyDocument.Statement = [];
            var statementOne: any = {};
            statementOne.Action = 'execute-api:Invoke';
            statementOne.Effect = effect;
            statementOne.Resource = resource;
            policyDocument.Statement[0] = statementOne;
            authResponse.policyDocument = policyDocument;
        }

        // Optional output with custom properties of the String, Number or Boolean type.

        if (token) {
            authResponse.context = { "jwtClaims": JSON.stringify(token) };
        }
        
        return authResponse;
    }
}