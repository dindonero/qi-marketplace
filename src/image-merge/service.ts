import sharp from 'sharp';
import {getRandomImageFromS3Bucket, uploadImage} from "@/aws/s3.service";
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

export const mintYiqiNFT = async (tokenId: number) => {

    const mainImageObj: S3Image = await getRandomImageFromS3Bucket("yiqi-transparent")
    const backgroundImageObj: S3Image = await getRandomImageFromS3Bucket("yiqi-background")

    const nftUrl = await imageMerge(mainImageObj, backgroundImageObj, tokenId) // TODO: change tokenId to be dynamic

    console.log(nftUrl);
}