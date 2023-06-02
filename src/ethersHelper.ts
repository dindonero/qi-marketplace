import {ethers} from "ethers";
import networkMapping from "../constants/networkMapping.json";
import {CHAIN_ID} from "../constants/configHelper";
import YiqiAbi from '../constants/Yiqi.json';
import YiqiBackgroundAbi from '../constants/YiqiBackground.json';


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
    return new ethers.Contract(yiqiTreasuryAddress, JSON.stringify(YiqiAbi), await getSigner());
}

export const getCurveContract = async () => {
    const curveAddress = networkMapping[CHAIN_ID].CurveEthStEthPool[networkMapping[CHAIN_ID].CurveEthStEthPool.length - 1]
    return new ethers.Contract(curveAddress, JSON.stringify(YiqiAbi), await getSigner());
}