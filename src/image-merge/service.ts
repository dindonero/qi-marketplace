import sharp from 'sharp';
import {uploadImage} from "@/aws/s3.service";
import {S3Image} from "@/aws/S3Image.type";


export const imageMerge = async (mainImage: S3Image, backgroundImage: S3Image, tokenId: number) => {

    const resizedBackgroundBuffer = await sharp(backgroundImage.body)
        .resize(1024, 1024, {fit: 'contain'})
        .toBuffer();

    const mergedImageBuffer = await sharp(resizedBackgroundBuffer)
        .composite([{input: mainImage.body, gravity: 'south'}])
        .toBuffer();

    return uploadImage(mergedImageBuffer, `${tokenId}.png`, {...mainImage.metadata, ...backgroundImage.metadata});
}