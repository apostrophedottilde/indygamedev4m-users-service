import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';
import { SNS, config } from 'aws-sdk';

config.update({ region: 'eu-west-1' });
const sns = new SNS({ apiVersion: '2010-03-31' })

export async function handler(event: DynamoDBStreamEvent): Promise<any> {
    try {
        const response = event.Records
            .filter((e: any) => e.eventName === 'REMOVE')
            .forEach(async (e) => {
                console.log(e)
                console.log("a removal")
                return await sns.publish({
                    Message: `User has been deleted`,
                    TopicArn: process.env.userDeregisteredTopicArn!
                }).promise();
            });
        return response;
    } catch (err) {
        console.log(err)
        return err;
    }
}

