import {ethers} from "ethers";
import networkMapping from "../../constants/networkMapping.json";
import QiAbi from "../../constants/Qi.json";

export const getQiContract = async () => {
    const provider = await getProvider(5)
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
    const qiAddress = networkMapping["5"].Qi[networkMapping["5"].Qi.length - 1]
    return new ethers.Contract(qiAddress, QiAbi, signer)
}

export const getQiBackgroundContract = async () => {
    const provider = await getProvider(5)
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
    const qiBackgroundAddress = networkMapping["5"].QiBackground[networkMapping["5"].QiBackground.length - 1]
    return new ethers.Contract(qiBackgroundAddress, QiAbi, signer)
}

const getProvider = async (chainId: number) => {
    switch (chainId) {
        case 1:
            return new ethers.JsonRpcProvider(process.env.INFURA_MAINNET_RPC_URL!)
        case 5:
            return new ethers.JsonRpcProvider(process.env.INFURA_GOERLI_RPC_URL!)
    }
}