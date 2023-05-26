import {NextPage} from "next";
import {useMoralis} from "react-moralis";
import {Alchemy, Network} from "alchemy-sdk";
import {requestBackgroundMetadataBackend, requestNFTMetadataBackend} from "@/nftMetadata/fetchMetadata";
import {useEffect, useState} from "react";
import NFTBox from "../components/NFTBox";

const ListNFTs: NextPage = ({nftAddress, isBackground = false}) => {

    const {isWeb3Enabled, account} = useMoralis()

    const [listedNfts, setListedNfts] = useState({})
    const [isFetchingNfts, setIsFetchingNfts] = useState<boolean>(true)

    const getTokenIdsOwnedByUser = async () => {

        const settings = {
            apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
            network: Network.ETH_GOERLI, // Replace with your network.
        };

        const alchemy = new Alchemy(settings);

        const {ownedNfts} = await alchemy.nft.getNftsForOwner(account!, {
            contractAddresses: [nftAddress],
            omitMetadata: true
        })
        return ownedNfts.map((nft: any) => nft.tokenId)
    }

    const fetchNFTMetadata = async () => {
        const tokenIds = await getTokenIdsOwnedByUser()
        let nftMetadatas = {}
        if (!isBackground) {
            nftMetadatas = await requestNFTMetadataBackend(tokenIds)
        } else {
            nftMetadatas = await requestBackgroundMetadataBackend(tokenIds)
        }
        console.log(nftMetadatas)
        return nftMetadatas
    }

    const fetchOwnedNfts = async () => {
        setIsFetchingNfts(true)
        const ownedNfts = await fetchNFTMetadata()
        setListedNfts(ownedNfts)
        setIsFetchingNfts(false)
    }

    async function updateUI() {
        await fetchOwnedNfts()
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])


    return (
        <div>
            <div className="container mx-auto">
                <div className="flex flex-wrap">
                    {isWeb3Enabled ? (
                        isFetchingNfts ? (
                            <div>Loading...</div>
                        ) : (
                            Object.keys(listedNfts).map((tokenId) => {
                                return (
                                    <NFTBox
                                        tokenId={tokenId}
                                        tokenMetadata={listedNfts[tokenId]}
                                        key={tokenId}
                                    />
                                )
                            })
                        )
                    ) : (
                        <div>Web3 Currently Not Enabled</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ListNFTs