import {DEFAULT_REGION} from "@/api/aws/aws-helper-config";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";


export const ddbClient = new DynamoDBClient({
    region: DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
});
