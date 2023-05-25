import {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import {useMoralis} from "react-moralis";
import networkMapping from "../constants/networkMapping.json"
import {CHAINID} from "../constants/chainId";

type AppContextType = {
    isConnectedToCorrectChain: boolean
}
export const AppContext = createContext<AppContextType | undefined>(undefined);
export const AppContextProvider: FC<{ children?: ReactNode | undefined }> = props => {

    const {Moralis, isWeb3Enabled} = useMoralis()

    const [isConnectedToCorrectChain, setIsConnectedToCorrectChain] = useState(false)

    const checkChainId = () => {
        setIsConnectedToCorrectChain(isWeb3Enabled && ((+Moralis.chainId!) !== CHAINID));
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
