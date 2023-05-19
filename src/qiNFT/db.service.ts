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
    return result.Item!;
}

export const getAllYiQiBaseFiles = async () => {
    const fileNameAttribute = "fileName";
    const command = new ScanCommand({ TableName: NFT_TABLE_NAME, ProjectionExpression: fileNameAttribute });

    const response = await ddbClient.send(command);

    if (!response.Items) {
        throw new Error("No items found");
    }

    return response.Items.map((item) => item[fileNameAttribute].S!);
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