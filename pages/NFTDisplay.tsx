import Image from "next/image"
import {Card} from "web3uikit"
import {useEffect, useState} from "react";
import { useRouter } from "next/router";
import BurnModal from "../components/BurnModal";
import ChangeBackgroundModal from "../components/ChangeBackgroundModal";
import {Button, useDisclosure} from "@chakra-ui/react";

export default function NFTDisplay() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isOpenBurnModal, SetisOpenBurnModal] = useState<boolean>(true)

    const router = useRouter();
    const tokenId = router.query.tokenId;
    const image = router.query.image;
    const backgroundImage = "https://yiqi-nft.s3.amazonaws.com/" + tokenId + ".png";

    return (
        <div style={{
            backgroundImage: `url(${image})`,
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
            <Button onClick={() => {
                SetisOpenBurnModal(true);
                onOpen();
                }}>Burn</Button>
            <div >
                {isOpenBurnModal ? <BurnModal isOpen={isOpen} onClose={onClose} tokenId={String(tokenId)} /> : null }
            </div>
            <Button onClick={() => {
                SetisOpenBurnModal(false);
                onOpen();
                }}>Change Background</Button>
            {isOpenBurnModal ? 
                <BurnModal isOpen={isOpen} onClose={onClose} tokenId={String(tokenId)} /> 
                : <ChangeBackgroundModal isOpen={isOpen} onClose={onClose} tokenId={String(tokenId)} />
            }
            <h1 className="font-bold text-5xl">#{tokenId}</h1>
        </div>
    )
}