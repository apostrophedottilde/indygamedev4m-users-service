import jwt = require("jsonwebtoken");

exports.handler = function (event: any, context: any, callback: any) {
    console.log(event)
    console.log(context)
    const tkn = event.headers["Authorizor"]

    const decodedToken = jwt.verify(tkn, 'sdkfheifnewurvh3457ewomtnv7854h6o48hbt78e4ucjr8945h7ybiorewirut3h4985d7u4239085byv34890d48o75yb347nd82374b834nifo5');

    console.log("decoded token");
    console.log(decodedToken);

    if (decodedToken) {
        callback(null, generatePolicy(decodedToken, 'user', 'Allow', event.methodArn));
    } else {
        callback(null, generatePolicy(decodedToken, 'user', 'Deny', event.methodArn));
    }
}

var generatePolicy = function (decodedToken: any, principalId: string, effect: any, resource: any) {
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
    authResponse.context = decodedToken;
    return authResponse;
}