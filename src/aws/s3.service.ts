import AWS from 'aws-sdk';

AWS.config.credentials = new AWS.Credentials({
    accessKeyId: 'AKIAUNWF6BHQVLSM3NEM',
    secretAccessKey: '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'
});

type S3Image = {
    key: string;
    body: Buffer;
}
export async function getRandomImageFromS3Bucket(bucketName: string): Promise<S3Image> {
    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

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

        return { key: randomObjectKey, body: s3Object.Body as Buffer };
    } catch (error) {
        console.error(error);
        throw error;
    }
}