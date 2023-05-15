import AWS from 'aws-sdk';
import {S3Image} from "./S3Image.type";

AWS.config.credentials = new AWS.Credentials({
    accessKeyId: 'AKIAUNWF6BHQVLSM3NEM',
    secretAccessKey: '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'
});

export const getImageFromS3Bucket = async (bucketName: string, key: string): Promise<S3Image> => {
    const s3 = new AWS.S3();

    const getObjectParams = {
        Bucket: bucketName,
        Key: key
    };

    const s3Object = await s3.getObject(getObjectParams).promise();

    return { key: key, body: s3Object.Body as Buffer, metadata: s3Object.Metadata! };
}
export const getRandomImageFromS3Bucket = async (bucketName: string): Promise<S3Image> => {
    const s3 = new AWS.S3();

    try {
        const listParams = {
            Bucket: bucketName
        };
        const s3ObjectList = await s3.listObjectsV2(listParams).promise();

        if (!s3ObjectList.Contents || s3ObjectList.Contents.length === 0) {
            throw new Error(`No objects found in bucket ${bucketName}`);
        }

        const randomIndex = Math.floor(Math.random() * s3ObjectList.Contents.length);
        const randomObjectKey = s3ObjectList.Contents[randomIndex].Key!;
        const getObjectParams = {
            Bucket: bucketName,
            Key: randomObjectKey
        };

        const s3Object = await s3.getObject(getObjectParams).promise();

        return { key: randomObjectKey, body: s3Object.Body as Buffer, metadata: s3Object.Metadata! };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const uploadImage = async (buffer: Buffer, key: string): Promise<string> => {
    const s3 = new AWS.S3();

    const params = {
        Bucket: 'yiqi-nft',
        Key: key,
        Body: buffer,
        ContentType: 'image/png',
    };

    try {
        await s3.putObject(params).promise();
        return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to upload image');
    }
};

export const getImageMetadata = async (bucketName: string, keyName: string): Promise<AWS.S3.Metadata> => {
    const s3 = new AWS.S3();

    const params = {
        Bucket: bucketName,
        Key: keyName,
    };

    try {
        const s3Object = await s3.getObject(params).promise();
        return s3Object.Metadata!;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to get image metadata');
    }
}

export const imageExists = async (bucketName: string, keyName: string): Promise<boolean> => {
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