import {BACKGROUND_TABLE_NAME} from "@/api/aws/aws-helper-config";
import {GetItemCommand, PutItemCommand} from "@aws-sdk/client-dynamodb";
import {ddbClient} from "@/api/aws/dynamoDB.config";

export const getBackgroundByTokenId = async (tokenId: number) => {

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

export const storeBackground = async (tokenId: number, fileName: string) => {
    const params = {
        TableName: BACKGROUND_TABLE_NAME,
        Item: {
            ["tokenId"]: { N: tokenId.toString() },
            ["fileName"]: { S: fileName },
        },
    };
    const command = new PutItemCommand(params);
    await ddbClient.send(command);
}

export const backgroundExists = async (tokenId: number) => {
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