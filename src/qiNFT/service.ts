import {imageMerge} from "@/image-merge/service";
import {
    getImageFromS3Bucket,
    getImageMetadata,
    getRandomImageFromS3Bucket,
    imageExists,
    uploadImage
} from "@/aws/s3.service";
import {QI_BACKGROUND_BUCKET, QI_NFT_BUCKET, QI_TRANSPARENT_BUCKET} from "@/aws/aws-helper-config";
import {S3Image} from "@/aws/S3Image.type";
import {getAllYiQiBaseFiles, getYiQiNFTByTokenId, storeYiQiNFT} from "@/qiNFT/db.service";
import {backgroundExists, getBackgroundByTokenId, storeBackground} from "@/qiBackground/db.service";
import {getBackgroundTokenIdFromYiQiNFT} from "@/provider/service";

export const getQiNFT = async (id: number): Promise<any> => {

    // if image is not uploaded on s3, generate nft image and upload it
    if (!(await imageExists(QI_NFT_BUCKET, `${id}.png`)))
        await mintYiqiNFT(id)

    // return nft json data
    return {
        yiqi_id: id,
        image: `https://${QI_NFT_BUCKET}.s3.amazonaws.com/${id}.png`,
        attributes: await getImageMetadata(QI_NFT_BUCKET, `${id}.png`)
    }
}

export const getYiQiBaseImage = async (tokenId: number) => {

    const yiQiNFT = await getYiQiNFTByTokenId(tokenId)
    const baseImageKey = yiQiNFT.fileName.S!

    return getImageFromS3Bucket(QI_TRANSPARENT_BUCKET, baseImageKey)
}

export const mintYiqiNFT = async (tokenId: number) => {

    const usedBaseImages = await getAllYiQiBaseFiles()

    const backgroundTokenId = await getBackgroundTokenIdFromYiQiNFT(tokenId)

    const mainImageObj: S3Image = await getRandomImageFromS3Bucket(QI_TRANSPARENT_BUCKET, usedBaseImages)
    let backgroundImageObj: S3Image
    if (await backgroundExists(tokenId))
        backgroundImageObj = await getImageFromS3Bucket(QI_BACKGROUND_BUCKET, (await getBackgroundByTokenId(backgroundTokenId))!.fileName.S!)
    else
        backgroundImageObj = await getRandomImageFromS3Bucket(QI_BACKGROUND_BUCKET)


    await storeYiQiNFT(tokenId, mainImageObj.key)
    await storeBackground(backgroundTokenId, backgroundImageObj.key)

    const yiQiImageBuffer = await imageMerge(mainImageObj, backgroundImageObj, tokenId)
    const nftUrl = await uploadImage(yiQiImageBuffer, `${tokenId}.png`, {...mainImageObj.metadata, ...backgroundImageObj.metadata});

    console.log(nftUrl);
}