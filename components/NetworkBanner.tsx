import {useMoralis} from "react-moralis"
import {useContext} from "react"
import { Button } from "@chakra-ui/react";
import {BannerStrip} from "web3uikit"
import {AppContext} from "../contexts/AppConfig";
import {CHAIN_ID} from "../constants/configHelper";


const NetworkBanner = () => {
    const {Moralis} = useMoralis()

    const appContext = useContext(AppContext)
    const changeNetwork = async () => {
        await Moralis.switchNetwork(CHAIN_ID)
    }

    return (
        appContext!.isConnectedToCorrectChain ? (
            <div >
                <BannerStrip id="wrongNetworkBanner" type="error" text="Connected to unsupported network"/>
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
        ) : <></>
    )
}

export default NetworkBanner