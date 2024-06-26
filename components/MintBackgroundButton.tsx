import React, {useContext} from 'react';
import {useMoralis} from "react-moralis";
import { useNotification} from 'web3uikit';
import { Button } from "@chakra-ui/react";
import {ContractTransactionReceipt, ethers} from 'ethers';
import YiqiBackgroundAbi from '../constants/YiqiBackground.json';
import {CHAIN_ID} from '../constants/configHelper';
import networkMapping from "../constants/networkMapping.json";
import {AppContext} from "../contexts/AppConfig";
import {requestBackgroundMetadataBackend, requestNFTMetadataBackend} from "@/nftMetadata/fetchMetadata";
import {getProvider, getYiqiBackgroundContract} from "@/ethersHelper";

export const MintBackgroundButton: React.FC = () => {

    const {isWeb3Enabled} = useMoralis();
    const appContext = useContext(AppContext);

    const dispatch = useNotification();

    const [isMinting, setIsMinting] = React.useState(false);

    const callMintFunction = async () => {
        try {
            setIsMinting(true);

            const yiqiBackgroundContract = await getYiqiBackgroundContract();
            const mintTx = await yiqiBackgroundContract.mint({value: ethers.parseEther("0.01")});

            const contractTxReceipt: ContractTransactionReceipt = await mintTx.wait(1);
            const txReceipt = await (await getProvider()).getTransactionReceipt(contractTxReceipt.hash);
            const tokenId = +txReceipt!.logs.slice(-1)[0].topics[2];

            await requestBackgroundMetadataBackend([tokenId])

            // todo use image retrieved from backend
            dispatch({
                type: "success",
                message: "Yiqi Background minted successfully",
                title: "Minted NFT",
                position: "topR"
            })
        } catch (error: any) {
            console.error('Error calling contract function:', error);
            dispatch({
                type: "error",
                message: error.info?.error?.message ? error.info.error.message : "Yiqi Background mint failed",
                title: "NFT Mint Failed",
                position: "topR"
            })
        }
        setIsMinting(false)
    };

    return (
        <div className="container mx-auto p-4">
            <Button isDisabled={!isWeb3Enabled || !appContext?.isConnectedToCorrectChain}
                onClick={callMintFunction} isLoading={isMinting} colorScheme="blue" rounded="md" size="md">
                    Mint Background
            </Button>
        </div>
    )
    ;
};