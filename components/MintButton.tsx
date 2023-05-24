import React from 'react';
import {useMoralis, useWeb3Contract} from "react-moralis";
import {Button, useNotification} from 'web3uikit';
import { ethers } from 'ethers';
import YiqiAbi from '../constants/Yiqi.json';
import { CHAINID } from '../constants/chainId';
import networkMapping from "../constants/networkMapping.json";
import {util} from "zod";
import objectKeys = util.objectKeys;

export const MintButton: React.FC = () => {
    const dispatch = useNotification();

    //get moralis
    const { web3, Moralis } = useMoralis();

    const [isMinting, setIsMinting] = React.useState(false);

    // Use ethers for contract function call
    const callMintFunction = async () => {
        try {
            setIsMinting(true);

            const provider = new ethers.BrowserProvider(window.ethereum)
            const yiqiAddress = networkMapping[CHAINID].Yiqi[networkMapping[CHAINID].Yiqi.length - 1]
            const yiqiContract = new ethers.Contract(yiqiAddress, YiqiAbi, await provider.getSigner());
            const mintTx = await yiqiContract.mint({value: ethers.parseEther("0.1")});
            await mintTx.wait(1);
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
                message: error.info.error.message ? error.info.error.message : "Yiqi minted failed",
                title: "NFT Mint Failed",
                position: "topR"
            })
        }
        setIsMinting(false)
    };

    return (
        <div className="container mx-auto">
            <div className="p-4">
                <Button text={"Mint"} onClick={callMintFunction} isLoading={isMinting} className="bg-blue-500 text-white rounded py-2 px-4"/>
            </div>
        </div>
    );
};