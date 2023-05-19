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

export const getBackgroundTokenIdFromYiQiNFT = async (tokenId: number) => {
    const qiContract = await getQiContract()
    return qiContract.s_tokenIdToQiBackgroundId(tokenId)
}

const getProvider = async (chainId: number) => {
    switch (chainId) {
        case 1:
            return new ethers.JsonRpcProvider(process.env.INFURA_MAINNET_RPC_URL!)
        case 5:
            return new ethers.JsonRpcProvider(process.env.INFURA_GOERLI_RPC_URL!)
    }
}

export const verifyYiQiNFTExists = async (tokenId: number) => {
    // verify qiNFT exists in nft collection
    const qiContract = await getQiContract()
    await verifyTokenExists(qiContract, tokenId)
}

export const verifyBackgroundExists = async (tokenId: number) => {
    const qiBackgroundContract = await getQiBackgroundContract()
    await verifyTokenExists(qiBackgroundContract, tokenId)
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
    if (recoveredAddress !== address) {
        throw new Error("Signature does not match the provided Ethereum address")
    }
}

export const verifyYiQiOwnership = async (tokenId: number, address: string) => {
    const qiContract = await getQiContract()
    try {
        await qiContract.ownerOf(tokenId)
    } catch (error: any) {
        if (error.reason === "ERC721: invalid token ID")
            throw new Error(`Token ${tokenId} has not been minted yet or has been burned`)
        else
            throw new Error(error.reason)
    }
    const owner = await qiContract.ownerOf(tokenId)
    if (owner !== address) {
        throw new Error(`YiQi NFT ${tokenId} is not owned by you`)
    }
}

export const verifyYiQiBackgroundOwnership = async (tokenId: number, address: string) => {
    const qiBackgroundContract = await getQiBackgroundContract()
    try {
        await qiBackgroundContract.ownerOf(tokenId)
    } catch (error: any) {
        if (error.reason === "ERC721: invalid token ID")
            throw new Error(`Token ${tokenId} has not been minted yet or has been burned`)
        else
            throw new Error(error.reason)
    }
    const owner = await qiBackgroundContract.ownerOf(tokenId)
    if (owner !== address) {
        throw new Error(`YiQi Background ${tokenId} is not owned by you`)
    }
}