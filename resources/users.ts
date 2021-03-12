import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB();

export async function main(event: any): Promise<any> {
    try {
        const method = event.httpMethod;

        if ("GET" === method) {
            const id = event.pathParameters["userId"]
            const getResult = await dynamo.getItem({
                TableName: process.env.TABLE_NAME!,
                Key: {
                    'ID': { S: '98aqy89rkbuttuyynvwsk' }
                }
            }).promise();

            return {
                body: JSON.stringify(getResult),
                statusCode: 200
            }
        }

        if ("POST" === method) {
            const data = JSON.parse(event.body);
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
        }
    } catch (err) {
        console.log(err)
        return { body: err.message, statusCode: 500 }
    }
}
