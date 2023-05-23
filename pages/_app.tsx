import "../styles/globals.css"
import Head from "next/head"
import type {AppProps} from "next/app"
import {MoralisProvider} from "react-moralis"
import NetworkBanner from "../components/NetworkBanner"
import {NotificationProvider} from "web3uikit"
import Header from "../components/Header"
import {AppContextProvider} from "../contexts/AppConfig";
import Mint from "../components/Mint";

function App({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <title>Yiqi</title>
                <link rel="shortcut icon" href="/favicon.ico"/>
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <AppContextProvider>
                    <NotificationProvider>
                        <NetworkBanner/>
                        <Header/>
                        <Mint/>
                        <Component {...pageProps} />
                    </NotificationProvider>
                </AppContextProvider>
            </MoralisProvider>
        </>
    )
}

export default App