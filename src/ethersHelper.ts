import {ethers} from "ethers";
import networkMapping from "../constants/networkMapping.json";
import {CHAIN_ID} from "../constants/configHelper";
import YiqiAbi from '../constants/Yiqi.json';
import YiqiTreasuryAbi from '../constants/YiqiTreasury.json';
import YiqiBackgroundAbi from '../constants/YiqiBackground.json';
import CurvePoolAbi from '../constants/CurvePool.json';


export const getProvider = async () => {
    return new ethers.BrowserProvider(window.ethereum)
}

export const getSigner = async () => {
    return (await getProvider()).getSigner()
}

export const getYiqiContract = async () => {
    const yiqiAddress = networkMapping[CHAIN_ID].Yiqi[networkMapping[CHAIN_ID].Yiqi.length - 1]
    return new ethers.Contract(yiqiAddress, JSON.stringify(YiqiAbi), await getSigner());
}

export const getYiqiBackgroundContract = async () => {
    const yiqiBackgroundAddress = networkMapping[CHAIN_ID].YiqiBackground[networkMapping[CHAIN_ID].YiqiBackground.length - 1]
    return new ethers.Contract(yiqiBackgroundAddress, JSON.stringify(YiqiBackgroundAbi), await getSigner());
}

export const getYiqiTreasuryContract = async () => {
    const yiqiTreasuryAddress = networkMapping[CHAIN_ID].YiqiTreasury[networkMapping[CHAIN_ID].YiqiTreasury.length - 1]
    return new ethers.Contract(yiqiTreasuryAddress, JSON.stringify(YiqiTreasuryAbi), await getSigner());
}

export const getCurveContract = async () => {
    const curveAddress = networkMapping[CHAIN_ID].CurveEthStEthPool[networkMapping[CHAIN_ID].CurveEthStEthPool.length - 1]
    return new ethers.Contract(curveAddress, JSON.stringify(CurvePoolAbi), await getSigner());
}

export const getYiqiNFTOwner = async (tokenId: number): Promise<string> => {
    const yiqiContract = await getYiqiContract()
    return yiqiContract.ownerOf(tokenId)
}

export const verifyYiqiNFTExists = async (tokenId: number) => {
    const yiqiContract = await getYiqiContract()
    try {
        await yiqiContract.ownerOf(tokenId)
        return true
    } catch (error: any) {
        if (error.reason === "ERC721: invalid token ID")
            return false
        else
            throw new Error(error.reason)
    }
}