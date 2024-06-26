import React, {useContext} from 'react';
import {useMoralis} from "react-moralis";
import { useNotification } from 'web3uikit';
import { Button,Tooltip } from "@chakra-ui/react";
import {ContractTransactionReceipt, ethers} from 'ethers';
import YiqiAbi from '../constants/Yiqi.json';
import {CHAIN_ID} from '../constants/configHelper';
import networkMapping from "../constants/networkMapping.json";
import {AppContext} from "../contexts/AppConfig";
import {requestNFTMetadataBackend} from "@/nftMetadata/fetchMetadata";
import {getProvider, getYiqiContract} from "@/ethersHelper";

export const MintButton: React.FC = () => {

    const {isWeb3Enabled} = useMoralis();
    const appContext = useContext(AppContext);

    const dispatch = useNotification();

    const [isMinting, setIsMinting] = React.useState(false);

    const callMintFunction = async () => {
        try {
            setIsMinting(true);

            const yiqiContract = await getYiqiContract();
            const mintTx = await yiqiContract.mint({value: await yiqiContract.MINT_PRICE()});

            const contractTxReceipt: ContractTransactionReceipt = await mintTx.wait(1);
            const txReceipt = await (await getProvider()).getTransactionReceipt(contractTxReceipt.hash);
            const tokenId = +txReceipt!.logs.slice(-1)[0].topics[2];

            await requestNFTMetadataBackend([tokenId])

            // todo use image retrieved from backend
            dispatch({
                type: "success",
                message: "Yiqi minted successfully",
                title: "Minted NFT",
                position: "topR"
            })
        } catch (error: any) {
            console.error('Error calling contract function:', error);
            dispatch({
                type: "error",
                message: error.info?.error?.message ? error.info.error.message : "Yiqi mint failed",
                title: "NFT Mint Failed",
                position: "topR"
            })
        }
        setIsMinting(false)
    };

    return (
        <Tooltip className="container mx-auto p-4" label={!isWeb3Enabled || !appContext?.isConnectedToCorrectChain ? 'Connect Wallet' : ''}>
            <Button isDisabled={!isWeb3Enabled || !appContext?.isConnectedToCorrectChain}
                onClick={callMintFunction} isLoading={isMinting} colorScheme="blue" rounded="md" size="md">
                    Mint
            </Button>
        </Tooltip>
    )
    ;
};