import {BACKGROUND_TABLE_NAME} from "@/api/aws/aws-helper-config";
import {GetItemCommand, PutItemCommand} from "@aws-sdk/client-dynamodb";
import {ddbClient} from "@/api/aws/dynamoDB.config";

export const getBackgroundByTokenIdFromDb = async (tokenId: number) => {

    const params = {
        TableName: BACKGROUND_TABLE_NAME,
        Key: {
            ["tokenId"]: {N: tokenId.toString()}
        }
    };
    const command = new GetItemCommand(params)
    const result = await ddbClient.send(command)
    return result.Item;
}

export const storeBackgroundInDb = async (tokenId: number, filename: string) => {
    const params = {
        TableName: BACKGROUND_TABLE_NAME,
        Item: {
            ["tokenId"]: { N: tokenId.toString() },
            ["filename"]: { S: filename },
        },
    };
    const command = new PutItemCommand(params);
    await ddbClient.send(command);
}

export const backgroundExistsInDb = async (tokenId: number) => {
    const params = {
        TableName: BACKGROUND_TABLE_NAME,
        Key: {
            ["tokenId"]: { N: tokenId.toString() },
        },
    };
    const command = new GetItemCommand(params);
    const result = await ddbClient.send(command);
    return Boolean(result.Item);
}