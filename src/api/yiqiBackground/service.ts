import {S3Image} from "@/api/aws/S3Image.type";
import {getImageFromS3Bucket, getImageMetadata, getRandomKeyFromS3Bucket} from "@/api/aws/s3.service";
import {QI_BACKGROUND_BUCKET} from "@/api/aws/aws-helper-config";
import {backgroundExistsInDb, getBackgroundByTokenIdFromDb, storeBackgroundInDb} from "@/api/yiqiBackground/db.service";


export const getYiqiBackground = async (tokenId: number) => {

    let backgroundKey: string

    if (await backgroundExistsInDb(tokenId)) {
        const backgroundObj = await getBackgroundByTokenIdFromDb(tokenId)
        backgroundKey = backgroundObj!.fileName.S!
    } else {
        backgroundKey = await getRandomKeyFromS3Bucket(QI_BACKGROUND_BUCKET)
        const backgroundImageObj: S3Image = await getImageFromS3Bucket(QI_BACKGROUND_BUCKET, backgroundKey)
        await storeBackgroundInDb(tokenId, backgroundImageObj.key)
    }

    return {
        yiqi_background_id: tokenId,
        image: `https://${QI_BACKGROUND_BUCKET}.s3.amazonaws.com/${backgroundKey!}`,
        attributes: await getImageMetadata(QI_BACKGROUND_BUCKET, backgroundKey!)
    }

}

export const getBackgroundImage = async (tokenId: number) => {

    const backgroundObj = await getBackgroundByTokenIdFromDb(tokenId)
    const backgroundKey = backgroundObj!.fileName.S!

    return getImageFromS3Bucket(QI_BACKGROUND_BUCKET, backgroundKey)
}