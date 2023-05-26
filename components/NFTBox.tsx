import Image from "next/image"
import {Card} from "web3uikit"
import {useEffect, useState} from "react";

export default function NFTBox({tokenId, tokenMetadataPromise }) {

    const [tokenMetadata, setTokenMetadata] = useState<any>(undefined)

    const handleTokenMetadataPromise = async () => {
        const fetchedTokenMetadata = await tokenMetadataPromise
        const jsonTokenMetadata = await fetchedTokenMetadata.json()
        setTokenMetadata(jsonTokenMetadata)
    }

    useEffect(() => {
        handleTokenMetadataPromise()
    }, [])

    return (
        tokenMetadata ? (
        <div>
            <Card
                title={`Yiqi #${tokenId}`}
            >
                <div className="p-2">
                    <div className="flex flex-col items-end gap-2">
                        <div>#{tokenId}</div>
                        <Image
                            alt={`Yiqi #${tokenId}`}
                            loader={() => tokenMetadata.image}
                            src={tokenMetadata.image}
                            height="200"
                            width="200"
                        />
                    </div>
                </div>
            </Card>
            <div className={"p-2"}/>
        </div>
        ) : (
            <div>Loading...</div>
        )
    )
}