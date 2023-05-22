import {getYiqiBackgroundContract} from "@/provider/service";
import {S3Image} from "@/aws/S3Image.type";
import {getImageFromS3Bucket, getImageMetadata, getRandomImageFromS3Bucket} from "@/aws/s3.service";
import {QI_BACKGROUND_BUCKET} from "@/aws/aws-helper-config";
import {backgroundExists, getBackgroundByTokenId, storeBackground} from "@/yiqiBackground/db.service";


export const getYiqiBackground = async (tokenId: number) => {

    let backgroundKey

    if (await backgroundExists(tokenId)) {
        const backgroundObj = await getBackgroundByTokenId(tokenId)
        backgroundKey = backgroundObj!.fileName.S
    } else {
        const backgroundImageObj: S3Image = await getRandomImageFromS3Bucket(QI_BACKGROUND_BUCKET)
        await storeBackground(tokenId, backgroundImageObj.key)
        backgroundKey = backgroundImageObj.key
    }

    return {
        yiqi_background_id: tokenId,
        image: `https://${QI_BACKGROUND_BUCKET}.s3.amazonaws.com/${backgroundKey}`,
        attributes: await getImageMetadata(QI_BACKGROUND_BUCKET, backgroundKey!)
    }


}

export const getBackgroundImage = async (tokenId: number) => {

    const backgroundObj = await getBackgroundByTokenId(tokenId)
    const backgroundKey = backgroundObj!.fileName.S!

    return getImageFromS3Bucket(QI_BACKGROUND_BUCKET, backgroundKey)
}