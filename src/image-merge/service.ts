import sharp from 'sharp';
import fs from 'fs';
import {getRandomImageFromS3Bucket} from "../aws/s3.service";

export const imageMerge = async () => {

    const mainImageObj = await getRandomImageFromS3Bucket("yiqi-transparent")
    const backgroundImageObj = await getRandomImageFromS3Bucket("yiqi-background")

    const resizedBackgroundBuffer = await sharp(backgroundImageObj.body)
        .resize(1024, 1024, {fit: 'contain'})
        .toBuffer();

    const mergedImageBuffer = await sharp(resizedBackgroundBuffer)
        .composite([{input: mainImageObj.body, gravity: 'south'}])
        .jpeg()
        .toBuffer()

    fs.writeFileSync('../../images/mergedImage.jpg', mergedImageBuffer);

}

imageMerge().then(() => {
    console.log("done")
})