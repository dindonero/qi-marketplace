import {NextPage} from "next";
import {useMoralis} from "react-moralis";
import {Button} from "web3uikit";
import networkMapping from "../constants/networkMapping.json";
import {CHAINID} from "../constants/chainId";
import {Alchemy, Network} from "alchemy-sdk";
import {requestNFTMetadataBackend} from "@/nftMetadata/fetchMetadata";

const Mint: NextPage = () => {

    const {isWeb3Enabled, Moralis, account} = useMoralis()

    const getTokenIdsOwnedByUser = async () => {

        const settings = {
            apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
            network: Network.ETH_GOERLI, // Replace with your network.
        };

        const alchemy = new Alchemy(settings);

        const {ownedNfts} = await alchemy.nft.getNftsForOwner(account!, {
            contractAddresses: [networkMapping[CHAINID].Yiqi[networkMapping[CHAINID].Yiqi.length - 1]],
            omitMetadata: true
        })
        console.log(ownedNfts.map((nft: any) => nft.tokenId))
        return ownedNfts.map((nft: any) => nft.tokenId)
    }

    const fetchNFTMetadata = async () => {
        const tokenIds = await getTokenIdsOwnedByUser()
        let ownedTokens = []
        for (const tokenId of tokenIds)
            ownedTokens.push(await requestNFTMetadataBackend(tokenId))
        console.log(ownedTokens)
        return ownedTokens
    }

    return (
        <div>
            <h1>Your NFTs</h1>
            <Button onClick={fetchNFTMetadata}>Get NFTs</Button>
        </div>
    )
}

export default Mint