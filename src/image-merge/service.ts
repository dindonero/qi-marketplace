import sharp from 'sharp';
import {getRandomImageFromS3Bucket, uploadImage} from "../aws/s3.service";
import {S3Image} from "../aws/S3Image.type";


export const imageMerge = async (mainImageBuffer: Buffer, backgroundImageBuffer: Buffer, tokenId: number) => {

    const resizedBackgroundBuffer = await sharp(backgroundImageBuffer)
        .resize(1024, 1024, {fit: 'contain'})
        .toBuffer();

    const mergedImageBuffer = await sharp(resizedBackgroundBuffer)
        .composite([{input: mainImageBuffer, gravity: 'south'}])
        .toBuffer();

    return uploadImage(mergedImageBuffer, `${tokenId}.png`);
}

export const mintYiqiNFT = async () => {

    const mainImageObj: S3Image = await getRandomImageFromS3Bucket("yiqi-transparent")
    const backgroundImageObj: S3Image = await getRandomImageFromS3Bucket("yiqi-background")

    const nftUrl = await imageMerge(mainImageObj.body, backgroundImageObj.body, 1) // TODO: change tokenId to be dynamic

    console.log(nftUrl);
}
mintYiqiNFT().then(() => {
    console.log("done")
})