import {imageMerge} from "@/image-merge/service";
import {getImageMetadata, getRandomImageFromS3Bucket, imageExists} from "@/aws/s3.service";
import {getQiContract} from "@/provider/service";
import {QI_BACKGROUND_BUCKET, QI_NFT_BUCKET, QI_TRANSPARENT_BUCKET} from "@/aws/aws-helper-config";
import {S3Image} from "@/aws/S3Image.type";

export const getQiNFT = async (id: number): Promise<any> => {

    // verify qiNFT exists in nft collection
    const qiContract = await getQiContract()
    try {
        await qiContract.ownerOf(id)
    } catch (error: any) {
        if (error.reason === "ERC721: invalid qiNFT ID")
            throw new Error(`Token ${id} has not been minted yet or has been burned`)
        else
            throw new Error(error.reason)
    }

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

export const mintYiqiNFT = async (tokenId: number) => {

    const mainImageObj: S3Image = await getRandomImageFromS3Bucket(QI_TRANSPARENT_BUCKET)
    const backgroundImageObj: S3Image = await getRandomImageFromS3Bucket(QI_BACKGROUND_BUCKET)

    const nftUrl = await imageMerge(mainImageObj, backgroundImageObj, tokenId) // TODO: change tokenId to be dynamic

    console.log(nftUrl);
}