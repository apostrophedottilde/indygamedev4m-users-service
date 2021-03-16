import { APIGatewayEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB();

export async function handler(event: APIGatewayEvent): Promise<any> {
    try {
        console.log(event);
        console.log(event.requestContext.authorizer);
        const data = JSON.parse(event.body!);
        const id: string = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const putResult = await dynamo.putItem({
            TableName: process.env.TABLE_NAME!,
            Item: {
                'ID': { S: id.toString() },
                'username': { S: data.username },
                'email': { S: data.email },
                'dob': { S: data.dob },
                'imageUrl': { S: 'http://url.com' }
            }
        }).promise();

        return {
            body: JSON.stringify({
                key1: JSON.stringify(putResult)
            }),
            statusCode: 200
        }
    } catch (err) {
        console.log(err)
        return { body: err.message, statusCode: 500 }
    }
}
