import { APIGatewayEvent, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB();

export async function handler(event: APIGatewayEvent, context: Context): Promise<any> {
    try {
        console.log(event);
        console.log(event.requestContext.authorizer);

        const id = event.pathParameters!.userId
        const getResult = await dynamo.getItem({
            TableName: process.env.TABLE_NAME!,
            Key: {
                'ID': { S: id }
            }
        }).promise();

        return {
            body: JSON.stringify(getResult),
            statusCode: 200
        }
    } catch (err) {
        console.log(err)
        return { body: err.message, statusCode: 500 }
    }
}
