import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import networkMapping from "../constants/networkMapping.json"
import { BannerStrip } from "web3uikit"

const isValidNetwork = (network: string) => {
    console.log(network, networkMapping.hasOwnProperty(network))
    return networkMapping.hasOwnProperty(network);
}

const NetworkBanner = () => {
    const { Moralis, isAuthenticated, web3, isWeb3Enabled, chainId } = useMoralis()

    const [currentChainId, setCurrentChainId] = useState<number | undefined>(undefined)

    const getChainId = async () => {
        if (isAuthenticated && isWeb3Enabled) {
            setCurrentChainId(chainId ? +chainId : undefined)
        }
        return 0
    }

    Moralis.onChainChanged(() => {
        getChainId()
    })

    const [showNetworkSwitcherDialog, setShowNetworkSwitcherDialog] = useState(false)

    useEffect(() => {
        console.log(currentChainId)
        if (
            currentChainId === undefined ||
            isValidNetwork(currentChainId ? currentChainId?.toString() : "")
        ) {
            setShowNetworkSwitcherDialog(false)
        } else {
            setShowNetworkSwitcherDialog(true)
        }
    }, [currentChainId])

    return (
        <>
            {showNetworkSwitcherDialog && (
                <BannerStrip type="error" text="Connected to unsupported network" />
                && (<div>
                    Wrong network
                </div>)
            )}

        </>
    )
}

export default NetworkBanner