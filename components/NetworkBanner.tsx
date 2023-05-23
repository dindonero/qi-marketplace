import {useMoralis} from "react-moralis"
import {useContext, useEffect, useState} from "react"
import networkMapping from "../constants/networkMapping.json"
import {BannerStrip, Button} from "web3uikit"
import {AppContext} from "../contexts/AppConfig";


const NetworkBanner = () => {
    const {Moralis} = useMoralis()

    const appContext= useContext(AppContext)
    const changeNetwork = async () => {
        await Moralis.switchNetwork(5)
    }


    return (appContext?.isConnectedToCorrectChain && (
            <div className="absolute top-0 right-0 p-2">
                <BannerStrip type="error" text="Connected to unsupported network" />
                <div className="h-4"></div>
                <Button
                    text={"Change Network"}
                    onClick={changeNetwork}
                    className="bg-red-500 text-white rounded-full py-2 px-4"
                >
                    <span className="text-xl font-bold mr-2">!</span>
                    <span>Change Network</span>
                </Button>
            </div>
        )
    )
}

export default NetworkBanner