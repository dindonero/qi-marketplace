import {NextPage} from "next";
import {useMoralis} from "react-moralis";
import {Alchemy, Network} from "alchemy-sdk";
import {requestBackgroundMetadataBackend, requestNFTMetadataBackend} from "@/nftMetadata/fetchMetadata";
import {useEffect, useState} from "react";
import NFTBox from "../components/NFTBox";
import {getTokenIdsOwnedByUser} from "@/nftMetadata/alchemyConnector";

interface ListNFTsProps {
    nftAddress: string,
    isBackground: boolean,
}

const ListNFTs = (props: ListNFTsProps) => {

    const {isWeb3Enabled, account} = useMoralis()

    const [listedNfts, setListedNfts] = useState<any>({})
    const [isFetchingNfts, setIsFetchingNfts] = useState<boolean>(true)

    const fetchNFTMetadata = async () => {
        const tokenIds = await getTokenIdsOwnedByUser(account!, props.nftAddress)
        let nftMetadatas
        if (!props.isBackground) {
            nftMetadatas = await requestNFTMetadataBackend(tokenIds)
        } else {
            nftMetadatas = await requestBackgroundMetadataBackend(tokenIds)
        }
        return nftMetadatas
    }

    const fetchOwnedNfts = async () => {
        setIsFetchingNfts(true)
        const ownedNfts = await fetchNFTMetadata()
        setListedNfts(ownedNfts)
        setIsFetchingNfts(false)
    }

    const isEmpty = (obj: any) => {
        return Object.keys(obj).length === 0;
    }

    async function updateUI() {
        await fetchOwnedNfts()
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled, account])


    return (
        <>
            <div className="container mx-auto">
                <div className="flex flex-wrap">
                    {isWeb3Enabled ? (
                        isFetchingNfts ? (
                            <div>Loading...</div>
                        ) : (
                            isEmpty(listedNfts) ? (
                                <div>No NFTs Owned</div>
                            ) : (
                                Object.keys(listedNfts).map((tokenId) => {
                                    return (
                                        <NFTBox
                                            tokenId={tokenId}
                                            tokenMetadataPromise={listedNfts[tokenId]}
                                            key={tokenId}
                                            isBackground={props.isBackground}
                                        />
                                    )
                                })
                            )
                        )
                    ) : (
                        <div>Web3 Currently Not Enabled</div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ListNFTs