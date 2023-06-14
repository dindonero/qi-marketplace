import {getYiqiBaseImage} from "@/api/yiqiNFT/service";
import {getBackgroundImage} from "@/api/yiqiBackground/service";
import {imageMerge} from "@/api/image-merge/service";
import {uploadImage} from "@/api/aws/s3.service";
import {updateYiqiNFTBackground} from "@/api/yiqiNFT/db.service";


export const changeBackground = async (tokenId: number, backgroundTokenId: number) => {

    const yiqiBaseImage = await getYiqiBaseImage(tokenId);
    const backgroundBaseImage = await getBackgroundImage(backgroundTokenId);

    const yiqiImageBuffer = await imageMerge(yiqiBaseImage, backgroundBaseImage, tokenId);

    const nftUrl = await uploadImage(yiqiImageBuffer, `${tokenId}.png`, {...yiqiBaseImage.metadata, ...backgroundBaseImage.metadata});

    await updateYiqiNFTBackground(tokenId, backgroundTokenId)

    console.log(nftUrl)
}