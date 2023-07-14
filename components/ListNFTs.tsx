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

    const [listedTokenIds, setListedTokenIds] = useState<number[] | undefined>(undefined)
    const [isFetchingNfts, setIsFetchingNfts] = useState<boolean>(true)

    const fetchOwnedTokenIds = async () => {
        setIsFetchingNfts(true)
        const tokenIds = await getTokenIdsOwnedByUser(account!, props.nftAddress)
        console.log(tokenIds)
        setListedTokenIds(tokenIds)
        setIsFetchingNfts(false)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            fetchOwnedTokenIds()
        }
    }, [isWeb3Enabled, account])


    return (
        <>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    isFetchingNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedTokenIds?.length == 0 ? (
                            <div>No NFTs Owned</div>
                        ) : (
                            listedTokenIds?.map((tokenId) => {
                                return (
                                    <NFTBox
                                        tokenId={tokenId}
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
        </>
    )
}

export default ListNFTs