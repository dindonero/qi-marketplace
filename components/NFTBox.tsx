import Image from "next/image"
import {Card} from "web3uikit"
import {useEffect, useState} from "react";
import { useRouter } from "next/router";
 
export default function NFTBox({tokenId, tokenMetadataPromise }: any) {

    const [tokenMetadata, setTokenMetadata] = useState<any>(undefined);
    const router = useRouter();

    const handleTokenMetadataPromise = async () => {
        const fetchedTokenMetadata = await tokenMetadataPromise
        const jsonTokenMetadata = await fetchedTokenMetadata.json()
        setTokenMetadata(jsonTokenMetadata)
    }

    useEffect(() => {
        handleTokenMetadataPromise()
    }, [])

    const navigateToYiQiDisplay = (tokenId : any) => {
        router.push(`/NFTDisplay?tokenId=${tokenId}`);
      };

    return (
        tokenMetadata ? (
        <div className="p-4">
            <Card
                title={`Yiqi #${tokenId}`}
                onClick={() => navigateToYiQiDisplay(tokenId)}
            >
                <div className="p-2">
                    <div className="flex flex-col items-end gap-2">
                        <div>#{tokenId}</div>
                        <Image
                            alt={`Yiqi #${tokenId}`}
                            loader={() => tokenMetadata.image}
                            src={tokenMetadata.image}
                            height="250"
                            width="250"
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