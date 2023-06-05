import {useMoralis} from "react-moralis"
import {useContext, useEffect} from "react"
import { Button } from "@chakra-ui/react";
import {BannerStrip, useNotification} from "web3uikit"
import {AppContext} from "../contexts/AppConfig";
import { MintButton } from "./MintButton";
import {CHAIN_ID} from "../constants/configHelper";


const NetworkBanner = () => {
    const {Moralis} = useMoralis()
    const dispatch = useNotification();

    const appContext = useContext(AppContext)
    const changeNetwork = async () => {
        await Moralis.switchNetwork(CHAIN_ID)
    }

    useEffect(() => {
        if (appContext?.isConnectedToCorrectChain !== undefined && !appContext?.isConnectedToCorrectChain) {
            dispatch({
                type: "error",
                message: "Change network",
                title: "Wrong Network Selected",
                position: "topR"
            })
        }
      }, [appContext?.isConnectedToCorrectChain]);

    return (
        appContext?.isConnectedToCorrectChain !== undefined && !appContext!.isConnectedToCorrectChain ? (
            <div >
                <div className="container mx-auto p-4">
                    <Button
                        onClick={changeNetwork}
                        colorScheme="red" rounded="md" size="md"
                    >
                        Change Network
                    </Button>
                </div>
                {/* <div className="bg-red-500 text-white rounded-full py-2 px-4">
                    <Button
                        text={"Change Network"}
                        onClick={changeNetwork}
                    />
                </div> */}
            </div>
        ) : <MintButton />
    )
}

export default NetworkBanner