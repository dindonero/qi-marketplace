import {imageMerge} from "@/api/image-merge/service";
import {
    getImageFromS3Bucket,
    getImageMetadata,
    getRandomKeyFromS3Bucket,
    imageExistsInS3,
    uploadImage
} from "@/api/aws/s3.service";
import {QI_BACKGROUND_BUCKET, QI_NFT_BUCKET, QI_TRANSPARENT_BUCKET} from "@/api/aws/aws-helper-config";
import {
    getAllYiqiBaseFilesFromDb,
    getYiqiNFTByTokenIdFromDb,
    storeYiqiNFTInDb,
    yiqiNFTExistsInDb
} from "@/api/yiqiNFT/db.service";
import {backgroundExistsInDb, getBackgroundByTokenIdFromDb, storeBackgroundInDb} from "@/api/yiqiBackground/db.service";
import {getBackgroundTokenIdFromYiqiNFT} from "@/api/provider/service";


export const getYiqiNFT = async (id: number): Promise<any> => {

    // if image is not uploaded on s3, generate nft image and upload it
    if (!(await imageExistsInS3(QI_NFT_BUCKET, `${id}.png`)))
        await mintYiqiNFT(id)

    // return nft json data
    return {
        yiqi_id: id,
        image: `https://${QI_NFT_BUCKET}.s3.amazonaws.com/${id}.png`,
        attributes: await getImageMetadata(QI_NFT_BUCKET, `${id}.png`)
    }
}

export const getYiqiBaseImage = async (tokenId: number) => {

    const yiqiNFT = await getYiqiNFTByTokenIdFromDb(tokenId)
    const baseImageKey = yiqiNFT.filename.S!

    return getImageFromS3Bucket(QI_TRANSPARENT_BUCKET, baseImageKey)
}

export const getTransparentURL = async (tokenId: number) => {

    const yiqiNFT = await getYiqiNFTByTokenIdFromDb(tokenId)
    const baseImageKey = yiqiNFT.filename.S!

    const backgroundFilenameRec = await getBackgroundByTokenIdFromDb(+yiqiNFT.backgroundTokenId.N!)
    const backgroundFilename = backgroundFilenameRec!.filename.S!

    return {
        image: `https://${QI_TRANSPARENT_BUCKET}.s3.amazonaws.com/${baseImageKey}`,
        background: `https://${QI_BACKGROUND_BUCKET}.s3.amazonaws.com/${backgroundFilename}`
    }
}

export const mintYiqiNFT = async (tokenId: number) => {

    const backgroundTokenId = await getBackgroundTokenIdFromYiqiNFT(tokenId)

    // if transparent filename is not stored in db, generate it
    let transparentImageKey: string = ""
    if (await yiqiNFTExistsInDb(tokenId)) {
        transparentImageKey = (await getYiqiNFTByTokenIdFromDb(tokenId)).filename.S!
    } else {
        // hack for concurrent requests that mint the same filename
        let gotUniqueFilename = false
        while (!gotUniqueFilename) {
            const usedBaseImages = await getAllYiqiBaseFilesFromDb()

            transparentImageKey = await getRandomKeyFromS3Bucket(QI_TRANSPARENT_BUCKET, usedBaseImages)

            gotUniqueFilename = await storeYiqiNFTInDb(tokenId, transparentImageKey, backgroundTokenId)
        }
    }

    // if background filename is not stored in db, generate it
    let backgroundImageKey: string
    if (await backgroundExistsInDb(backgroundTokenId)) {
        backgroundImageKey = (await getBackgroundByTokenIdFromDb(backgroundTokenId))!.filename.S!
    } else {
        backgroundImageKey = await getRandomKeyFromS3Bucket(QI_BACKGROUND_BUCKET)
        await storeBackgroundInDb(backgroundTokenId, backgroundImageKey)
    }

    // merge images and upload to s3
    const tranparentImageObj = await getImageFromS3Bucket(QI_TRANSPARENT_BUCKET, transparentImageKey)
    const backgroundImageObj = await getImageFromS3Bucket(QI_BACKGROUND_BUCKET, backgroundImageKey)
    const yiqiImageBuffer = await imageMerge(tranparentImageObj, backgroundImageObj, tokenId)

    const nftUrl = await uploadImage(yiqiImageBuffer, `${tokenId}.png`, {...tranparentImageObj.metadata, ...backgroundImageObj.metadata});

    console.log(`NFT ${tokenId} minted at ${nftUrl}`)
    return `Successfully minted QiCity ${tokenId}`
}