import {NFT_TABLE_NAME} from "@/api/aws/aws-helper-config";
import {GetItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand} from "@aws-sdk/client-dynamodb";
import {ddbClient} from "@/api/aws/dynamoDB.config";

export const getYiqiNFTByTokenId = async (tokenId: number) => {

    const params = {
        TableName: NFT_TABLE_NAME,
        Key: {
            ["tokenId"]: {N: tokenId.toString()}
        }
    };
    const command = new GetItemCommand(params)
    const result = await ddbClient.send(command)

    return result.Item!;
}

export const getAllYiqiBaseFiles = async () => {
    const fileNameAttribute = "fileName";
    const command = new ScanCommand({ TableName: NFT_TABLE_NAME, ProjectionExpression: fileNameAttribute });

    const response = await ddbClient.send(command);

    if (!response.Items) {
        throw new Error("No items found");
    }

    return response.Items.map((item) => item[fileNameAttribute].S!);
}

export const storeYiqiNFT = async (tokenId: number, fileName: string, backgroundTokenId: number) => {
    const params = {
        TableName: NFT_TABLE_NAME,
        Item: {
            ["tokenId"]: { N: tokenId.toString() },
            ["fileName"]: { S: fileName },
            ["backgroundTokenId"]: { N: backgroundTokenId.toString() },
        },
    };
    const command = new PutItemCommand(params);
    await ddbClient.send(command);
}

export const updateYiqiNFTBackground = async (tokenId: number, backgroundTokenId: number) => {
    const params = {
        TableName: NFT_TABLE_NAME,
        Key: {
            "tokenId": { N: tokenId.toString() },
        },
        UpdateExpression: "SET backgroundTokenId = :b",
        ExpressionAttributeValues: {
            ":b": { N: backgroundTokenId.toString() },
        }
    };
    const command = new UpdateItemCommand(params);
    await ddbClient.send(command);
}

export const yiqiNFTExists = async (tokenId: number) => {
    const params = {
        TableName: NFT_TABLE_NAME,
        Key: {
            ["tokenId"]: { N: tokenId.toString() },
        },
    };
    const command = new GetItemCommand(params);
    const result = await ddbClient.send(command);
    return Boolean(result.Item);
}