import AWS from "aws-sdk";

export type S3Image = {
    key: string;
    body: Buffer;
    metadata: AWS.S3.Metadata;
}