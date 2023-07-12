import {PutItemCommand, ScanCommand} from "@aws-sdk/client-dynamodb";
import {ddbClient} from "@/api/aws/dynamoDB.config";
import {NFT_TABLE_NAME} from "@/api/aws/aws-helper-config";

export const getYiqiNFTByTokenIdFromDb = async (tokenId: number) => {
    const params = {
        TableName: NFT_TABLE_NAME,
        FilterExpression: "#tokenId = :tokenId",
        ExpressionAttributeNames: {
            "#tokenId": "tokenId",
        },
        ExpressionAttributeValues: {
            ":tokenId": { N: tokenId.toString() }
        }
    };

    const command = new ScanCommand(params);
    const result = await ddbClient.send(command);
    return result.Items!.at(0)!;
}

export const getAllYiqiBaseFilesFromDb = async () => {
    const filenameAttribute = "filename";
    const command = new ScanCommand({TableName: NFT_TABLE_NAME, ProjectionExpression: filenameAttribute});

    const response = await ddbClient.send(command);

    return response.Items?.map((item) => item[filenameAttribute].S!);
}

export const storeYiqiNFTInDb = async (tokenId: number, filename: string, backgroundTokenId: number) => {
    const params = {
        TableName: NFT_TABLE_NAME,
        Item: {
            ["filename"]: {S: filename},
            ["tokenId"]: {N: tokenId.toString()},
            ["backgroundTokenId"]: {N: backgroundTokenId.toString()},
        },
        ConditionExpression: "attribute_not_exists(filename)" // Only succeed if filename doesn't exist
    };
    const command = new PutItemCommand(params);
    try {
        await ddbClient.send(command);
        return true;
    } catch (error: any) {
        if (error.name === "ConditionalCheckFailedException") {
            return false; // Return false if filename already exists
        }
        throw error;
    }
}

export const updateYiqiNFTBackgroundInDb = async (tokenId: number, backgroundTokenId: number) => {
    const params = {
        TableName: NFT_TABLE_NAME,
        FilterExpression: "#tokenId = :tokenId",
        ExpressionAttributeNames: {
            "#tokenId": "tokenId",
        },
        ExpressionAttributeValues: {
            ":tokenId": { N: tokenId.toString() },
            ":b": {N: backgroundTokenId.toString()},
        },
        UpdateExpression: "SET backgroundTokenId = :b",
    };
    const command = new ScanCommand(params);
    await ddbClient.send(command);
}

export const yiqiNFTExistsInDb = async (tokenId: number) => {
    const params = {
        TableName: NFT_TABLE_NAME,
        FilterExpression: "#tokenId = :tokenId",
        ExpressionAttributeNames: {
            "#tokenId": "tokenId",
        },
        ExpressionAttributeValues: {
            ":tokenId": { N: tokenId.toString() },
        },
    };
    const command = new ScanCommand(params);
    const result = await ddbClient.send(command);
    return result.Items!.length !== 0;
}
