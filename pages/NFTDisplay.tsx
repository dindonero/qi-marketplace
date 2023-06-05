import Image from "next/image"
import {Card} from "web3uikit"
import {useEffect, useState} from "react";
import { useRouter } from "next/router";

export default function NFTDisplay() {

    const router = useRouter();
    const tokenId = router.query.tokenId;
    const tokenMetadataImage = router.query.tokenMetadataImage;
    const backgroundImage = "https://yiqi-nft.s3.amazonaws.com/" + tokenId + ".png";

    // const handleTokenMetadataPromise = async () => {
    //     const fetchedTokenMetadata = await tokenMetadataPromise
    //     const jsonTokenMetadata = await fetchedTokenMetadata.json()
    //     setTokenMetadata(jsonTokenMetadata)
    // }

    // useEffect(() => {
    //     handleTokenMetadataPromise()
    // }, [])

    return (
        <div style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "contain",
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
            {/* <h1 className="font-bold text-5xl">#{tokenId}</h1> */}
        </div>
        // <div className="p-4">
        //         <div className="p-2">
        //                 <h1>#{tokenId}</h1>
        //                 <Image
        //                     alt={`Yiqi #${tokenId}`}
        //                     loader={() => "https://yiqi-nft.s3.amazonaws.com/" + tokenId + ".png"}
        //                     src={"https://yiqi-nft.s3.amazonaws.com/" + tokenId + ".png"}
        //                     height="800"
        //                     width="800"
        //                 />
        //         </div>
        // </div>
    )
}