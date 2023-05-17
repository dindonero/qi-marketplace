import {BACKGROUND_TABLE_NAME, NFT_TABLE_NAME} from "@/aws/aws-helper-config";
import {DescribeTableCommand, GetItemCommand, PutItemCommand, ScanCommand} from "@aws-sdk/client-dynamodb";
import {ddbClient} from "@/aws/dynamoDB.config";

export const getYiQiNFTByTokenId = async (tokenId: number) => {

    const params = {
        TableName: NFT_TABLE_NAME,
        Key: {
            ["tokenId"]: {N: tokenId.toString()}
        }
    };
    const command = new GetItemCommand(params)
    const result = await ddbClient.send(command)
    return result.Item;
}

export const getAllYiQiBaseFiles = async () => {
    const command = new DescribeTableCommand({ TableName: NFT_TABLE_NAME });
    const response = await ddbClient.send(command);

    if (!response.Table?.AttributeDefinitions) {
        throw new Error("Table schema not found");
    }

    return response.Table.AttributeDefinitions.map((attr) => attr.AttributeName!);
}

export const storeYiQiNFT = async (tokenId: number, fileName: string) => {
    const params = {
        TableName: NFT_TABLE_NAME,
        Item: {
            ["tokenId"]: { N: tokenId.toString() },
            ["fileName"]: { S: fileName },
        },
    };
    const command = new PutItemCommand(params);
    await ddbClient.send(command);
}

export const yiQiNFTExists = async (tokenId: number) => {
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