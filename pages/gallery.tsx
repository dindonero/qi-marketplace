import React, {useCallback, useEffect, useState} from 'react';
import {NextPage} from "next";
import {useMoralis} from "react-moralis";
import NFTBox from "../components/NFTBox";
import {requestNFTMetadataBackend} from "@/nftMetadata/fetchMetadata";
import {Button, Spinner} from "@chakra-ui/react";
import {verifyYiqiNFTExists} from "@/ethersHelper";


const ListAllTokens: NextPage = () => {
    const {isWeb3Enabled} = useMoralis();
    const [listedTokens, setListedTokens] = useState<number[]>([]);
    const [isFetchingTokens, setIsFetchingTokens] = useState<boolean>(false);
    const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
    const tokenFetchChunkSize = 20;  // Define how many tokens to fetch at once
    const maxTokens = 8888;  // Define the total number of tokens

    const fetchTokens = useCallback(async () => {
        if (currentTokenIndex >= maxTokens) return;
        setIsFetchingTokens(true);
        let newTokens: number[] = [];
        for (let i = currentTokenIndex; i < currentTokenIndex + tokenFetchChunkSize; i++) {
            if (i >= maxTokens) break;
            if (await verifyYiqiNFTExists(i))
                newTokens.push(i);
        }
        setListedTokens((prevState: number[]) => (prevState.concat(newTokens)));
        setCurrentTokenIndex(prev => prev + tokenFetchChunkSize);
        setIsFetchingTokens(false);
    }, [currentTokenIndex])

    useEffect(() => {
        if (isWeb3Enabled)
            fetchTokens();
    }, [isWeb3Enabled]);

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
                                        key={tokenId}
                                        isBackground={false}
                                    />
                                );
                            })}
                        </div>
                        <div className="text-center">
                            {(currentTokenIndex < maxTokens) ? <Spinner/> : <div>No More Tokens to Display</div>}
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
