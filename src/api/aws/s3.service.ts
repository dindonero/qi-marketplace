import AWS from 'aws-sdk';
import {S3Image} from "./S3Image.type";

AWS.config.credentials = new AWS.Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
});

export const getImageFromS3Bucket = async (bucketName: string, key: string): Promise<S3Image> => {
    const s3 = new AWS.S3();

    const getObjectParams = {
        Bucket: bucketName,
        Key: key
    };

    const s3Object = await s3.getObject(getObjectParams).promise();

    return {key: key, body: s3Object.Body as Buffer, metadata: s3Object.Metadata!};
}

export const getRandomKeyFromS3Bucket = async (bucketName: string, usedImageKeys?: string[]): Promise<string> => {
    const s3 = new AWS.S3();

    const listParams = {
        Bucket: bucketName
    };
    const s3ObjectList = await s3.listObjectsV2(listParams).promise();

    if (!s3ObjectList.Contents || s3ObjectList.Contents.length === 0) {
        throw new Error(`No objects found in bucket ${bucketName}`);
    }

    // Remove used images from list
    if (usedImageKeys) {
        const unusedImages = s3ObjectList.Contents.filter((s3Object) => !usedImageKeys.includes(s3Object.Key!));
        if (unusedImages.length === 0) {
            throw new Error(`No unused objects found in bucket ${bucketName}`);
        }
        s3ObjectList.Contents = unusedImages;
    }

    const randomIndex = Math.floor(Math.random() * s3ObjectList.Contents.length);
    return s3ObjectList.Contents[randomIndex].Key!;
}

export const uploadImage = async (buffer: Buffer, key: string, metadata: any): Promise<string> => {
    const s3 = new AWS.S3();

    const params = {
        Bucket: 'yiqi-nft',
        Key: key,
        Body: buffer,
        ContentType: 'image/png',
        CacheControl: 'no-cache, must-revalidate',
        Metadata: metadata
    };

    try {
        await s3.putObject(params).promise();
        return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to upload image');
    }
};

export const getImageMetadata = async (bucketName: string, keyName: string) => {
    const s3 = new AWS.S3();

    const params = {
        Bucket: bucketName,
        Key: keyName,
    };

    try {
        const s3Object = await s3.headObject(params).promise();
        return Object.entries(s3Object.Metadata!).map(([trait_type, value]) => ({trait_type, value}));
    } catch (err) {
        console.error(err);
        throw new Error('Failed to get image metadata');
    }
}

export const imageExistsInS3 = async (bucketName: string, keyName: string): Promise<boolean> => {
    const s3 = new AWS.S3();

    const params = {
        Bucket: bucketName,
        Key: keyName,
    };

    try {
        await s3.headObject(params).promise();
        return true;
    } catch (err) {
        return false;
    }
}