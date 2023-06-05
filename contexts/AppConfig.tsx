import {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import {useMoralis} from "react-moralis";
import networkMapping from "../constants/networkMapping.json"
import {CHAIN_ID} from "../constants/configHelper";

type AppContextType = {
    isConnectedToCorrectChain: boolean | undefined
}
export const AppContext = createContext<AppContextType | undefined>(undefined);
export const AppContextProvider: FC<{ children?: ReactNode | undefined }> = props => {

    const {Moralis, isWeb3Enabled} = useMoralis()

    const [isConnectedToCorrectChain, setIsConnectedToCorrectChain] = useState<boolean | undefined>(undefined)

    const checkChainId = () => {
        console.log()
        setIsConnectedToCorrectChain(isWeb3Enabled && ((+Moralis.chainId!) === CHAIN_ID));
    }

    useEffect(() => {
        checkChainId()
    }, [Moralis.chainId, isWeb3Enabled])


    const contextValues = {
        isConnectedToCorrectChain
    }

    return (
        <AppContext.Provider value={contextValues}>
            {props.children}
        </AppContext.Provider>
    );
};
