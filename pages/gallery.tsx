import React, {useCallback, useEffect, useState} from 'react';
import {NextPage} from "next";
import {useMoralis} from "react-moralis";
import NFTBox from "../components/NFTBox";
import {requestNFTMetadataBackend} from "@/nftMetadata/fetchMetadata";
import {Button} from "@chakra-ui/react";


const ListAllTokens: NextPage = () => {
    const {isWeb3Enabled} = useMoralis();
    const [listedTokens, setListedTokens] = useState<any>({});
    const [isFetchingTokens, setIsFetchingTokens] = useState<boolean>(false);
    const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
    const tokenFetchChunkSize = 20;  // Define how many tokens to fetch at once
    const maxTokens = 8888;  // Define the total number of tokens

    const fetchTokenMetadata = async (startIndex: number, endIndex: number) => {
        const tokenIds = Array.from({length: endIndex - startIndex}, (_, i) => startIndex + i);
        return requestNFTMetadataBackend(tokenIds);
    }

    const fetchTokens = useCallback(async () => {
        if (currentTokenIndex >= maxTokens) return;
        setIsFetchingTokens(true);
        const newTokens = await fetchTokenMetadata(currentTokenIndex, currentTokenIndex + tokenFetchChunkSize);
        setListedTokens((prevState: any) => ({...prevState, ...newTokens}));
        setCurrentTokenIndex(prev => prev + tokenFetchChunkSize);
        setIsFetchingTokens(false);
    }, [currentTokenIndex])

    useEffect(() => {
        fetchTokens();
    }, []);

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
        <div>
            {isWeb3Enabled ? (
                isFetchingTokens ? (
                    <div>Loading...</div>
                ) : (
                    <div>
                        <div className="flex flex-wrap justify-center">
                            {Object.keys(listedTokens).map((tokenId) => {
                                return (
                                    <NFTBox
                                        tokenId={tokenId}
                                        tokenMetadataPromise={listedTokens[tokenId]}
                                        key={tokenId}
                                        isBackground={false}
                                    />
                                );
                            })}
                        </div>
                        <div className="text-center">
                            {(currentTokenIndex < maxTokens) ? <Button onClick={fetchTokens} isDisabled={isFetchingTokens}>Load More</Button> : <div>No More Tokens to Display</div>}
                        </div>
                    </div>
                )
            ) : (
                <div>Web3 Currently Not Enabled</div>
            )}
        </div>
    );
}

export default ListAllTokens;
