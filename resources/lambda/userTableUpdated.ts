import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';
import { SNS, config } from 'aws-sdk';

config.update({ region: 'eu-west-1' });
const sns = new SNS({ apiVersion: '2010-03-31' })

export async function handler(event: DynamoDBStreamEvent): Promise<null> {
    try {
        event.Records.forEach(async (e: DynamoDBRecord) => {
            console.log(e.eventName!);
            if (e.eventName! == "REMOVE") {
                console.log(event)
                const response = await sns.publish({
                    Message: `User has been deleted`,
                    TopicArn: process.env.userDeregisteredTopicArn!
                }).promise();
                console.log(response);
            }
        });
        return null;
    } catch (err) {
        console.log(err)
        return err;
    }
}

