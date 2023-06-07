import {Alchemy, Network} from "alchemy-sdk";


export const getTokenIdsOwnedByUser = async (account: string, contractAddress: string) => {


    const settings = {
        apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
        network: Network.ETH_GOERLI, // Replace with your network.
    };

    const alchemy = new Alchemy(settings);

    const {ownedNfts} = await alchemy.nft.getNftsForOwner(account, {
        contractAddresses: [contractAddress],
        omitMetadata: true
    })
    return ownedNfts.map((nft: any) => nft.tokenId)
}