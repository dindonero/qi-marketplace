import React from 'react';
import { useWeb3Contract } from "react-moralis";
import { useNotification } from 'web3uikit';
import { ethers } from 'ethers';

const ContractFunctionCaller: React.FC = () => {
    const dispatch = useNotification();

    // Use ethers for contract function call
    const callMintFunction = async () => {
        try {
            const contractAddress = 'CONTRACT_ADDRESS';
            const contractAbi = [
                // Contract ABI here
            ];

            const contract = new ethers.Contract(contractAddress, contractAbi);
            const response = await contract.contractFunction();
            dispatch({
                type: "success",
                message: "Yiqi minted successfully",
                title: "Minted NFT",
                position: "topR"
            })
        } catch (error) {
            console.error('Error calling contract function:', error);
            dispatch({
                type: "error",
                message: "Yiqi minted failed",
                title: "NFT Mint Failed",
                position: "topR"
            })
        }
    };

    return (
        <div className="container mx-auto">
            <div className="p-4">
                <button onClick={callMintFunction} className="bg-blue-500 text-white rounded py-2 px-4">
                    Call Contract Function (Ethers)
                </button>
            </div>
        </div>
    );
};

export default ContractFunctionCaller;
