import * as cdk from '@aws-cdk/core';
import * as lambda from "@aws-cdk/aws-lambda";
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { Bucket } from '@aws-cdk/aws-s3';
import { Function } from '@aws-cdk/aws-lambda';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';

export class UsersServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dbTable = new Table(this, 'user-data-table', {
      tableName: 'user-data-table',
      partitionKey: {
        name: 'ID',
        type: AttributeType.STRING
      },
    });

    const handler = new Function(this, "UserHandler", {
      runtime: lambda.Runtime.NODEJS_10_X, // So we can use async in User.js
      code: lambda.Code.fromAsset("resources"),
      handler: "users.main",
      environment: {
        TABLE_NAME: dbTable.tableName
      }
    });

    dbTable.grantFullAccess(handler);

    const api = new RestApi(this, "foremz-user-api");

    const getIntegration = new LambdaIntegration(handler);

    const postIntegration = new LambdaIntegration(handler);

    const deleteIntegration = new LambdaIntegration(handler);

    api.root.addMethod('GET', getIntegration);

    api.root.addMethod('POST', postIntegration);

    api.root.addMethod('DELETE', deleteIntegration);

  }

}
