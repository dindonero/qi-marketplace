import {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import {useMoralis} from "react-moralis";

type AppContextType = {
    isConnectedToCorrectChain: boolean
}
export const AppContext = createContext<AppContextType | undefined>(undefined);
export const AppContextProvider: FC<{ children?: ReactNode | undefined }> = props => {

    const {Moralis, isWeb3Enabled} = useMoralis()

    const [isConnectedToCorrectChain, setIsConnectedToCorrectChain] = useState(false)

    const checkChainId = () => {
        if (!isWeb3Enabled || (+Moralis.chainId!).toString() === "5") {
            setIsConnectedToCorrectChain(false)
        } else {
            setIsConnectedToCorrectChain(true)
        }
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
