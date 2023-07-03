import React, {useCallback, useEffect, useState} from 'react';
import {NextPage} from "next";
import {useMoralis} from "react-moralis";
import NFTBox from "../components/NFTBox";
import {requestNFTMetadataBackend} from "@/nftMetadata/fetchMetadata";


const ListAllTokens: NextPage = () => {
    const {isWeb3Enabled} = useMoralis();
    const [listedTokens, setListedTokens] = useState<any>({});
    const [isFetchingTokens, setIsFetchingTokens] = useState<boolean>(false);
    const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
    const tokenFetchChunkSize = 20;  // Define how many tokens to fetch at once

    const isEmpty = (obj: any) => {
        return Object.keys(obj).length === 0;
    }

    const fetchTokenMetadata = async (startIndex: number, endIndex: number) => {
        const tokenIds = Array.from({length: endIndex - startIndex}, (_, i) => startIndex + i);
        return requestNFTMetadataBackend(tokenIds);
    }

    const fetchTokens = useCallback(async () => {
        if (!isFetchingTokens) {
            setIsFetchingTokens(true);
            const newTokens = await fetchTokenMetadata(currentTokenIndex, currentTokenIndex + tokenFetchChunkSize);
            setListedTokens((prevState: any) => ({...prevState, ...newTokens}));
            setCurrentTokenIndex(prev => prev + tokenFetchChunkSize);
            setIsFetchingTokens(false);
        }
    }, [currentTokenIndex, isFetchingTokens]);

    useEffect(() => {
        fetchTokens();
    }, [fetchTokens]);

    useEffect(() => {
        const onScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 2
            ) {
                if (!isFetchingTokens) {
                    fetchTokens();
                }
            }
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [isFetchingTokens, fetchTokens]);

    return (
        <div className="flex flex-wrap">
            {isWeb3Enabled ? (
                isFetchingTokens ? (
                    <div>Loading...</div>
                ) : (
                    isEmpty(listedTokens) ? (
                        <div>No Tokens Available</div>
                    ) : (
                        Object.keys(listedTokens).map((tokenId) => {
                            return (
                                <NFTBox
                                    tokenId={tokenId}
                                    tokenMetadataPromise={listedTokens[tokenId]}
                                    key={tokenId}
                                    isBackground={false}
                                />
                            );
                        })
                    )
                )
            ) : (
                <div>Web3 Currently Not Enabled</div>
            )}
        </div>
    );
}

export default ListAllTokens;