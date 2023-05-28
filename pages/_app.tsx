import "../styles/globals.css"
import Head from "next/head"
import type {AppProps} from "next/app"
import {MoralisProvider} from "react-moralis"
import NetworkBanner from "../components/NetworkBanner"
import {NotificationProvider} from "web3uikit"
import Header from "../components/Header"
import {AppContextProvider} from "../contexts/AppConfig";
import {MintButton} from "../components/MintButton";
import Link from "next/link";
import { ChakraProvider } from "@chakra-ui/react";

function App({Component, pageProps}: AppProps) {
    return (
        <>
            <MoralisProvider initializeOnMount={false}>
                <AppContextProvider>
                    <NotificationProvider>
                        <NetworkBanner/>
                        <ChakraProvider>
                            <Header/>
                            <Component {...pageProps} />
                        </ChakraProvider>
                    </NotificationProvider>
                </AppContextProvider>
            </MoralisProvider>
        </>
    )
}

export default App