import { APIGatewayEvent } from 'aws-lambda';

export async function handler(event: APIGatewayEvent): Promise<any> {
    try {
        return {
            body: JSON.stringify({}),
            statusCode: 200
        }
    } catch (err) {
        console.log(err)
        return { body: err.message, statusCode: 500 }
    }
}
