import { APIGatewayEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB();

export async function handler(event: APIGatewayEvent): Promise<any> {
    try {
        const id = event.pathParameters!.userId
        await dynamo.deleteItem({
            TableName: process.env.TABLE_NAME!,
            Key: {
                'ID': { S: id }
            }
        }).promise();

        return {
            statusCode: 201
        }
    } catch (err) {
        console.log(err)
        return { body: err.message, statusCode: 500 }
    }
}
