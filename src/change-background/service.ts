import {getYiqiBaseImage} from "@/yiqiNFT/service";
import {getBackgroundImage} from "@/yiqiBackground/service";
import {imageMerge} from "@/image-merge/service";
import {uploadImage} from "@/aws/s3.service";


export const changeBackground = async (tokenId: number, backgroundTokenId: number) => {

    const yiqiBaseImage = await getYiqiBaseImage(tokenId);
    const backgroundBaseImage = await getBackgroundImage(backgroundTokenId);

    const yiqiImageBuffer = await imageMerge(yiqiBaseImage, backgroundBaseImage, tokenId);

    const nftUrl = await uploadImage(yiqiImageBuffer, `${tokenId}.png`, {...yiqiBaseImage.metadata, ...backgroundBaseImage.metadata});

    console.log(nftUrl)
}