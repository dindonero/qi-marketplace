import {imageMerge} from "@/api/image-merge/service";
import {
    getImageFromS3Bucket,
    getImageMetadata,
    getRandomImageFromS3Bucket,
    imageExists,
    uploadImage
} from "@/api/aws/s3.service";
import {QI_BACKGROUND_BUCKET, QI_NFT_BUCKET, QI_TRANSPARENT_BUCKET} from "@/api/aws/aws-helper-config";
import {S3Image} from "@/api/aws/S3Image.type";
import {getAllYiqiBaseFiles, getYiqiNFTByTokenId, storeYiqiNFT} from "@/api/yiqiNFT/db.service";
import {backgroundExists, getBackgroundByTokenId, storeBackground} from "@/api/yiqiBackground/db.service";
import {getBackgroundTokenIdFromYiqiNFT} from "@/api/provider/service";

export const getYiqiNFT = async (id: number): Promise<any> => {

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

export const getYiqiBaseImage = async (tokenId: number) => {

    const yiqiNFT = await getYiqiNFTByTokenId(tokenId)
    const baseImageKey = yiqiNFT.fileName.S!

    return getImageFromS3Bucket(QI_TRANSPARENT_BUCKET, baseImageKey)
}

export const mintYiqiNFT = async (tokenId: number) => {

    const usedBaseImages = await getAllYiqiBaseFiles()

    const backgroundTokenId = await getBackgroundTokenIdFromYiqiNFT(tokenId)

    const mainImageObj: S3Image = await getRandomImageFromS3Bucket(QI_TRANSPARENT_BUCKET, usedBaseImages)
    let backgroundImageObj: S3Image
    if (await backgroundExists(tokenId))
        backgroundImageObj = await getImageFromS3Bucket(QI_BACKGROUND_BUCKET, (await getBackgroundByTokenId(backgroundTokenId))!.fileName.S!)
    else
        backgroundImageObj = await getRandomImageFromS3Bucket(QI_BACKGROUND_BUCKET)


    await storeYiqiNFT(tokenId, mainImageObj.key)
    await storeBackground(backgroundTokenId, backgroundImageObj.key)

    const yiqiImageBuffer = await imageMerge(mainImageObj, backgroundImageObj, tokenId)
    const nftUrl = await uploadImage(yiqiImageBuffer, `${tokenId}.png`, {...mainImageObj.metadata, ...backgroundImageObj.metadata});

    console.log(nftUrl);
}