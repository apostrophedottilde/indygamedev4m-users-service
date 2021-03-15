import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';
import { SNS, config } from 'aws-sdk';

config.update({ region: 'eu-west-1' });
const sns = new SNS({ apiVersion: '2010-03-31' })

export async function handler(event: DynamoDBStreamEvent): Promise<any> {
    try {
        const response = event.Records.map(async (e: any) => {
            console.log(e.eventName);
            if (e.eventName == "REMOVE") {
                console.log(event)
                return sns.publish({
                    Message: `User has been deleted`,
                    TopicArn: process.env.userDeregisteredTopicArn!
                }).promise();
            }
            return null;
        });
        return response;
    } catch (err) {
        console.log(err)
        return err;
    }
}

