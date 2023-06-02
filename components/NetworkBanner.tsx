import {useMoralis} from "react-moralis"
import {useContext, useEffect} from "react"
import { Button } from "@chakra-ui/react";
import {useNotification} from "web3uikit"
import {AppContext} from "../contexts/AppConfig";
import {CHAINID} from "../constants/chainId";
import { MintButton } from "./MintButton";


const NetworkBanner = () => {
    const {Moralis} = useMoralis()
    const dispatch = useNotification();

    const appContext = useContext(AppContext)
    const changeNetwork = async () => {
        await Moralis.switchNetwork(CHAINID)
    }

    useEffect(() => {
        console.log(!appContext?.isConnectedToCorrectChain)
        if (appContext?.isConnectedToCorrectChain) {
            dispatch({
                type: "error",
                message: "Change network",
                title: "Wrong Network Selected",
                position: "topR"
            })
        }
      }, [appContext?.isConnectedToCorrectChain]);

    return (
        appContext!.isConnectedToCorrectChain ? (
            <div className="container mx-auto p-4">
                <Button
                    onClick={changeNetwork}
                    colorScheme="red" rounded="md" size="md"
                >
                    Change Network
                </Button>
            </div>
        ) : <MintButton />
    )
}

export default NetworkBanner