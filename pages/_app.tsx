import "../styles/globals.css"
import Head from "next/head"
import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"
import NetworkBanner from "../components/NetworkBanner"
import { NotificationProvider } from "web3uikit"
import Header from "../components/Header"

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Yiqi</title>
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                    <NetworkBanner />
                    <Header />
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </>
    )
}
export default MyApp