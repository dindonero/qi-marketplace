import Image from "next/image"
import {Card} from "web3uikit"
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Box, Spinner} from "@chakra-ui/react";
import {requestBackgroundMetadata, requestNFTMetadata, requestNFTMetadataBackend} from "@/nftMetadata/fetchMetadata";

export default function NFTBox({tokenId, isBackground}: any) {

    const [tokenMetadata, setTokenMetadata] = useState<any>(undefined);
    const router = useRouter();

    const handleTokenMetadataPromise = async () => {
        let nftMetadata
        if (!isBackground) {
            nftMetadata = await requestNFTMetadata(tokenId)
        } else {
            nftMetadata = await requestBackgroundMetadata(tokenId)
        }
        console.log(nftMetadata)
        const jsonTokenMetadata = await nftMetadata.json()
        console.log(jsonTokenMetadata)
        setTokenMetadata(jsonTokenMetadata)
    }

    useEffect(() => {
        handleTokenMetadataPromise()
    }, [])

    const navigateToYiQiDisplay = (tokenId: any) => {
        router.push(`/NFTDisplay?tokenId=${tokenId}`);
    };

    return !tokenMetadata || tokenMetadata.image ? (
        <div className="p-4">
            <Card
                title={`Yiqi #${tokenId}`}
                onClick={!isBackground ? () => navigateToYiQiDisplay(tokenId) : undefined}
            >
                <div className="p-2">
                    <div className="flex flex-col items-end gap-2">
                        <div>#{tokenId}</div>
                        {tokenMetadata ?
                            <Image
                                alt={`Yiqi #${tokenId}`}
                                loader={() => tokenMetadata.image}
                                src={tokenMetadata.image}
                                height="250"
                                width="250"/>
                            :
                            <div className={"relative"}>
                                <div
                                    className="flex items-center justify-center"
                                    style={{width: 250, height: 250}}>
                                    <Spinner/>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </Card>
            <div className={"p-2"}/>
        </div>
    ) : (
        <></>
    )
}