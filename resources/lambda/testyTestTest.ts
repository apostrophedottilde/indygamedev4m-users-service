import { SNSEvent, SNSEventRecord } from 'aws-lambda';

export async function handler(event: SNSEvent): Promise<null> {
    try {
        event.Records.forEach((e: SNSEventRecord) => {
            console.log("Externall subscribed and reacted to sns topic in another app by ARN of topic")
            console.info(JSON.stringify(e));
        })
        return null
    } catch (err) {
        console.log(err)
        return err;
    }
}
