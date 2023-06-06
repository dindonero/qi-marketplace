import React, {useState} from 'react';
import {useMoralis} from "react-moralis";
import {useNotification} from 'web3uikit';
import {Button} from "@chakra-ui/react";
import {getProvider} from "@/ethersHelper";
import {CHANGE_BACKGROUND_MESSAGE} from "../constants/configHelper";

interface ChangeBackgroundButtonProps {
    tokenId: string;
    backgroundTokenId: string;
}
export const ChangeBackgroundButton = (props: ChangeBackgroundButtonProps) => {

    const { isWeb3Enabled, chainId, account} = useMoralis();
    const dispatch = useNotification();

    const [isLoading, setIsLoading] = useState(false);


    const handleChangeBackground = async () => {
        setIsLoading(true)
        try {
            const message = CHANGE_BACKGROUND_MESSAGE(account!, props.tokenId, props.backgroundTokenId);
            const signer = await (await getProvider()).getSigner()

            const signature = await signer.signMessage(message);

            const body = {
                account: account!,
                tokenId: props.tokenId,
                backgroundTokenId: props.backgroundTokenId,
                signature: signature
            }

            const response = await fetch("/api/change-background", {
                method: "POST",
                body: JSON.stringify(body)
            })
            const result = await response.json();
            dispatch({
                type: "success",
                message: result.status,
                title: "Change Background",
                position: "topR"
            })
        } catch (error: any) {
            console.log(error)
            dispatch({
                type: "error",
                message: error.info?.error?.message ? error.info.error.message : "Yiqi background change failed",
                title: "Change Background Failed",
                position: "topR"
            })
        }
        setIsLoading(false);
    }

    return (
        <div className="container mx-auto p-4">
            <Button onClick={handleChangeBackground} isDisabled={!isWeb3Enabled} isLoading={isLoading} colorScheme="blue" rounded="md" size="md">
                Change Background
            </Button>
        </div>
    )
};

export default ChangeBackgroundButton;