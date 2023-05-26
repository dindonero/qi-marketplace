import {useMoralis} from "react-moralis"
import {useContext} from "react"
import {BannerStrip, Button} from "web3uikit"
import {AppContext} from "../contexts/AppConfig";
import {CHAINID} from "../constants/chainId";


const NetworkBanner = () => {
    const {Moralis} = useMoralis()

    const appContext = useContext(AppContext)
    const changeNetwork = async () => {
        await Moralis.switchNetwork(CHAINID)
    }

    return (
        appContext!.isConnectedToCorrectChain ? (
            <div className="absolute top-0 right-0 p-2">
                <BannerStrip id="wrongNetworkBanner" type="error" text="Connected to unsupported network"/>
                <div className="h-4"></div>
                <Button
                    text={"Change Network"}
                    onClick={changeNetwork}
                />
            </div>
        ) : <></>
    )
}

export default NetworkBanner