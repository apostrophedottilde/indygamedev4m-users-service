import { DynamoDBStreamEvent } from 'aws-lambda';
import { SNS, config } from 'aws-sdk';

config.update({ region: 'eu-west-1' });
const sns = new SNS({ apiVersion: '2010-03-31' })

export async function handler(event: DynamoDBStreamEvent): Promise<null> {
    try {
        const response = await sns.publish({
            Message: 'MESSAGE_TEXT', /* required */
            TopicArn: process.env.userDeregisteredTopicArn!
        }).promise();
        console.log(response);
        console.log("did at least try inniut")
        return null;
    } catch (err) {
        console.log(err)
        return err;
    }
}

