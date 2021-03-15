import * as cdk from '@aws-cdk/core';
import { Authorizer, LambdaIntegration, Resource, RestApi, TokenAuthorizer } from '@aws-cdk/aws-apigateway';
import { Code, Function, Runtime, StartingPosition } from '@aws-cdk/aws-lambda';
import { AttributeType, Table, StreamViewType } from '@aws-cdk/aws-dynamodb';
import { Queue } from '@aws-cdk/aws-sqs';
import { Topic } from '@aws-cdk/aws-sns';
import { LambdaSubscription } from '@aws-cdk/aws-sns-subscriptions';
import { DynamoEventSource, SqsDlq } from '@aws-cdk/aws-lambda-event-sources';
import { SNS } from 'aws-sdk';

export class UsersServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dbTable = new Table(this, 'user-data-table', {
      tableName: 'user-data-table',
      partitionKey: {
        name: 'ID',
        type: AttributeType.STRING
      },
      stream: StreamViewType.NEW_IMAGE
    });

    const getUserhandler = new Function(this, 'get_user_handler', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset("resources/lambda/users"),
      handler: "getUser.handler",
      environment: {
        TABLE_NAME: dbTable.tableName
      }
    });

    const createUserHandler = new Function(this, 'create_user_handler', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('resources/lambda/users'),
      handler: "createUser.handler",
      environment: {
        TABLE_NAME: dbTable.tableName
      }
    });

    const deregisterUserHandler = new Function(this, 'deregister_user_handler', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('resources/lambda/users'),
      handler: "deregisterUser.handler",
      environment: {
        TABLE_NAME: dbTable.tableName
      }
    });

    const getUserProfileImageHandler = new Function(this, 'get_user_profile_image_handler', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('resources/lambda/profileImages'),
      handler: "getUserProfileImage.handler",
      environment: {
        TABLE_NAME: dbTable.tableName
      }
    });

    const deleteUserProfileImagehandler = new Function(this, 'delete_user_profile_image_handler', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('resources/lambda/profileImages'),
      handler: "deleteUserProfileImage.handler",
      environment: {
        TABLE_NAME: dbTable.tableName
      }
    });

    const setUserProfileImagehandler = new Function(this, 'set_user_profile_image_handler', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('resources/lambda/profileImages'),
      handler: "setUserProfileImage.handler",
      environment: {
        TABLE_NAME: dbTable.tableName
      }
    });

    const authHandler = new Function(this, 'auth_handler', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('resources/lambda/profileImages'),
      handler: "auth.handler",
      environment: {
        TABLE_NAME: dbTable.tableName
      }
    });

    dbTable.grantReadData(getUserhandler);
    dbTable.grantWriteData(createUserHandler);
    dbTable.grantReadWriteData(deregisterUserHandler);

    const api: RestApi = new RestApi(this, "foremz-user-api");
    const author = new TokenAuthorizer(this, 'api-authorizeor', {
      handler: authHandler
    });

    author._attachToApi(api);


    const usersResource: Resource = api.root.addResource('users');
    usersResource.addMethod('POST', new LambdaIntegration(createUserHandler));

    const specificUser: Resource = usersResource.addResource('{userId}');
    specificUser.addMethod('GET', new LambdaIntegration(getUserhandler))
    specificUser.addMethod('DELETE', new LambdaIntegration(deregisterUserHandler));

    const profileImageResource: Resource = specificUser.addResource('profileImage');
    profileImageResource.addMethod('GET', new LambdaIntegration(getUserProfileImageHandler));
    profileImageResource.addMethod('PUT', new LambdaIntegration(setUserProfileImagehandler));
    profileImageResource.addMethod('DELETE', new LambdaIntegration(deleteUserProfileImagehandler));

    const deadLetterQueue = new Queue(this, 'user_deregistered_DLQ');

    const userDeregisteredTopic = new Topic(this, 'user_deregistered_sns_topic', {
      displayName: 'User deregistered topic',
      fifo: false, // standard
      topicName: 'user_deregistered_sns_topic',
    });

    const testyTestTest = new Function(this, 'testyTestTest', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('resources/lambda'),
      handler: "testyTestTest.handler",
    });

    const userTableUpdatedHandler = new Function(this, 'user_table_updated_handler', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('resources/lambda'),
      handler: "userTableUpdated.handler",
      environment: {
        userDeregisteredTopicArn: userDeregisteredTopic.topicArn
      }
    });

    userDeregisteredTopic.grantPublish(userTableUpdatedHandler);

    const otherSide = Topic.fromTopicArn(this, 'external_user_deregistered_topic', userDeregisteredTopic.topicArn)

    otherSide.addSubscription(new LambdaSubscription(testyTestTest));

    const dynamoSource = new DynamoEventSource(dbTable, {
      startingPosition: StartingPosition.TRIM_HORIZON,
      onFailure: new SqsDlq(deadLetterQueue),
      batchSize: 5,
      enabled: true,
      retryAttempts: 5
    });

    userTableUpdatedHandler.addEventSource(dynamoSource);
  }
}
