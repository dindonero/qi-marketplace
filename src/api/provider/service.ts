import {ethers} from "ethers";
import networkMapping from "../../../constants/networkMapping.json";
import YiqiAbi from "../../../constants/Yiqi.json";
import YiqiBackgroundAbi from "../../../constants/YiqiBackground.json";
import {CHAIN_ID} from "../../../constants/configHelper";

export const getYiqiContract = async () => {
    const provider = await getProvider(CHAIN_ID)
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
    const yiqiAddress = networkMapping[CHAIN_ID].Yiqi[networkMapping[CHAIN_ID].Yiqi.length - 1]
    return new ethers.Contract(yiqiAddress, JSON.stringify(YiqiAbi), signer)
}

export const getYiqiBackgroundContract = async () => {
    const provider = await getProvider(CHAIN_ID)
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
    const yiqiBackgroundAddress = networkMapping[CHAIN_ID].YiqiBackground[networkMapping[CHAIN_ID].YiqiBackground.length - 1]
    return new ethers.Contract(yiqiBackgroundAddress, JSON.stringify(YiqiBackgroundAbi), signer)
}

export const getBackgroundTokenIdFromYiqiNFT = async (tokenId: number) => {
    const yiqiContract = await getYiqiContract()
    return yiqiContract.getBackgroundFromTokenId(tokenId)
}

const getProvider = async (chainId: number) => {
    switch (chainId) {
        case 1:
            return new ethers.JsonRpcProvider(process.env.INFURA_MAINNET_RPC_URL!)
        case 5:
            return new ethers.JsonRpcProvider(process.env.INFURA_GOERLI_RPC_URL!)
        case 31337:
            return new ethers.JsonRpcProvider("http://localhost:8545")
    }
}

export const verifyYiqiNFTExists = async (tokenId: number) => {
    // verify yiqiNFT exists in nft collection
    const yiqiContract = await getYiqiContract()
    await verifyTokenExists(yiqiContract, tokenId)
}

export const verifyBackgroundExists = async (tokenId: number) => {
    const yiqiBackgroundContract = await getYiqiBackgroundContract()
    await verifyTokenExists(yiqiBackgroundContract, tokenId)
}

const verifyTokenExists = async (contract: ethers.Contract, tokenId: number) => {
    try {
        await contract.ownerOf(tokenId)
    } catch (error: any) {
        if (error.reason === "ERC721: invalid token ID")
            throw new Error(`Token ${tokenId} has not been minted yet or has been burned`)
        else
            throw new Error(error.reason)
    }
}

export const verifySignature = async (message: string, signature: string, address: string) => {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    if (recoveredAddress !== address)
        throw new Error("Signature does not match the provided Ethereum address")
}

export const verifyYiqiOwnership = async (tokenId: number, address: string) => {
    const yiqiContract = await getYiqiContract()
    let owner
    try {
        owner = await yiqiContract.ownerOf(tokenId)
    } catch (error: any) {
        if (error.reason === "ERC721: invalid token ID")
            throw new Error(`Token ${tokenId} has not been minted yet or has been burned`)
        else
            throw new Error(error.reason)
    }
    if (owner !== address) {
        throw new Error(`Yiqi NFT ${tokenId} is not owned by you`)
    }
}

export const verifyYiqiBackgroundOwnership = async (tokenId: number, address: string) => {
    const yiqiBackgroundContract = await getYiqiBackgroundContract()
    let owner
    try {
        owner = await yiqiBackgroundContract.ownerOf(tokenId)
    } catch (error: any) {
        if (error.reason === "ERC721: invalid token ID")
            throw new Error(`Token ${tokenId} has not been minted yet or has been burned`)
        else
            throw new Error(error.reason)
    }
    if (owner !== address) {
        throw new Error(`Yiqi Background ${tokenId} is not owned by you`)
    }
}