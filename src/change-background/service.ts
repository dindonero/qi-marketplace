import {getYiQiBaseImage} from "@/qiNFT/service";
import {getBackgroundImage} from "@/qiBackground/service";
import {imageMerge} from "@/image-merge/service";
import {uploadImage} from "@/aws/s3.service";


export const changeBackground = async (tokenId: number, backgroundTokenId: number) => {

    const yiQiBaseImage = await getYiQiBaseImage(tokenId);
    const backgroundBaseImage = await getBackgroundImage(backgroundTokenId);

    const yiQiImageBuffer = await imageMerge(yiQiBaseImage, backgroundBaseImage, tokenId);

    const nftUrl = await uploadImage(yiQiImageBuffer, `${tokenId}.png`, {...yiQiBaseImage.metadata, ...backgroundBaseImage.metadata});

    console.log(nftUrl)
}