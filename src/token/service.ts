import {ethers} from "ethers";
import QiAbi from "../../constants/Qi.json";
import networkMapping from "../../constants/networkMapping.json";
import {mintYiqiNFT} from "@/image-merge/service";
import {getImageMetadata, imageExists} from "@/aws/s3.service";

export const tokenService = async (id: number): Promise<any> => {

    // verify token exists in nft collection
    const INFURA_RPC_URL = process.env.INFURA_GOERLI_RPC_URL!
    const provider = new ethers.JsonRpcProvider(INFURA_RPC_URL)
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
    const qiAddress = networkMapping["5"].Qi[networkMapping["5"].Qi.length - 1]

    const qiContract = new ethers.Contract(qiAddress, QiAbi, signer)
    try {
        await qiContract.ownerOf(id)
    } catch (error: any) {
        if (error.reason === "ERC721: invalid token ID")
            throw new Error(`Token ${id} has not been minted yet or has been burned`)
    }

    // if image is not uploaded on s3, generate nft image and upload it
    if (!(await imageExists("yiqi-nft", `${id}.png`)))
        await mintYiqiNFT(id)

    console.log(await getImageMetadata("yiqi-nft", `${id}.png`))
    // return nft json data
    return {
        yiqi_id: id,
        image: `https://yiqi-nft.s3.amazonaws.com/${id}.png`,
        attributes: await getImageMetadata("yiqi-nft", `${id}.png`)
    }


}
