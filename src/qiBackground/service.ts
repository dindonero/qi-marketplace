import {getQiBackgroundContract} from "@/provider/service";
import {S3Image} from "@/aws/S3Image.type";
import {getImageMetadata, getRandomImageFromS3Bucket} from "@/aws/s3.service";
import {QI_BACKGROUND_BUCKET} from "@/aws/aws-helper-config";
import {backgroundExists, getBackgroundByTokenId, storeBackground} from "@/qiBackground/db.service";


export const getQiBackground = async (tokenId: number) => {

    const qiBackgroundContract = await getQiBackgroundContract()

    try {
        await qiBackgroundContract.ownerOf(tokenId)
    } catch (error: any) {
        if (error.reason === "ERC721: invalid qiNFT ID")
            throw new Error(`Token ${tokenId} has not been minted yet or has been burned`)
        else
            throw new Error(error.reason)
    }

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