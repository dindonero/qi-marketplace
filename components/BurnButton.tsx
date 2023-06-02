import React, {useContext, useState} from 'react';
import {useMoralis} from "react-moralis";
import { useNotification} from 'web3uikit';
import { Button } from "@chakra-ui/react";
import {ContractTransactionReceipt, ethers} from 'ethers';
import YiqiAbi from '../constants/Yiqi.json';
import {CHAIN_ID} from '../constants/configHelper';
import networkMapping from "../constants/networkMapping.json";
import {AppContext} from "../contexts/AppConfig";
import {requestNFTMetadataBackend} from "@/nftMetadata/fetchMetadata";
import {getProvider, getYiqiContract} from "@/ethersHelper";

interface BurnButtonProps {
    tokenId: string;
    minAmountOut?: ethers.BigNumberish;
}
export const BurnButton = (props: BurnButtonProps) => {

    const appContext = useContext(AppContext);

    const {isWeb3Enabled} = useMoralis();
    const dispatch = useNotification();

    const [isBurning, setIsBurning] = useState(false);


    const callBurnFunction = async () => {
        try {
            setIsBurning(true);

            const yiqiContract = await getYiqiContract();
            const burnTx = await yiqiContract.burn(props.tokenId, props.minAmountOut);

            const burnReceipt = await burnTx.wait(1);
            const decodedLog = yiqiContract.interface.parseLog(burnReceipt!.logs.slice(-1)[0])
            const ethReceived = decodedLog!.args.ethAmountReturned;
            const ethAmountReturnedInEther = ethers.formatEther(ethReceived);

            dispatch({
                type: "success",
                message: `Successfully burned Yiqi NFT and received ${ethAmountReturnedInEther} ETH`,
                title: "Minted NFT",
                position: "topR"
            })
        } catch (error: any) {
            console.error('Error calling contract function:', error);
            dispatch({
                type: "error",
                message: error.info?.error?.message ? error.info.error.message : "Yiqi Background burn failed",
                title: "NFT Burn Failed",
                position: "topR"
            })
        }
        setIsBurning(false);
    }

    return (
        <div className="container mx-auto p-4">
            <Button isDisabled={!isWeb3Enabled || appContext?.isConnectedToCorrectChain || !props.minAmountOut}
                    onClick={callBurnFunction} isLoading={isBurning} colorScheme="red" rounded="md" size="md">
                Burn
            </Button>
        </div>
    )
};

export default BurnButton;