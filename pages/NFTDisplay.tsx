import {useState} from "react";
import {useRouter} from "next/router";
import BurnModal from "../components/BurnModal";
import ChangeBackgroundModal from "../components/ChangeBackgroundModal";
import {Box, Button, useDisclosure} from "@chakra-ui/react";
import OpenseaButton from "../components/OpenseaButton";

export default function NFTDisplay() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isOpenBurnModal, SetisOpenBurnModal] = useState<boolean>(true);

    const router = useRouter();
    const tokenId = +router.query.tokenId!;
    const noBackground = "https://yiqi-transparent.s3.eu-north-1.amazonaws.com/0_0+(1)_transparent.png";
    const backgroundImage = "https://yiqi-background.s3.amazonaws.com/1.png";

    return (
        <div style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100vh",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white"
        }}>
            <Box
                position="absolute"
                top={5}
                right={5}
                display="flex"
                flexDirection="column"
                gap={4}
            >
                <Button
                    onClick={() => {
                        SetisOpenBurnModal(true);
                        onOpen();
                    }}
                    colorScheme="red"
                    _hover={{ bg: 'red.700' }}
                >
                    Burn
                </Button>
                <Button
                    onClick={() => {
                        SetisOpenBurnModal(false);
                        onOpen();
                    }}
                    colorScheme="blue"
                    _hover={{ bg: 'blue.700' }}
                >
                    Change Background
                </Button>
                <OpenseaButton
                    tokenId={tokenId.toString()}
                    isBackground={false}
                />
            </Box>
            <h1 style={{ position: "absolute", top: 10, left: 10, fontSize: "2rem" }}>#{tokenId}</h1>
            {isOpenBurnModal ?
                <BurnModal isOpen={isOpen} onClose={onClose} tokenId={String(tokenId)} />
                : <ChangeBackgroundModal isOpen={isOpen} onClose={onClose} tokenId={String(tokenId)} />
            }
            <img src={noBackground} alt="Foreground" style={{
                position: "absolute",
                objectFit: 'contain',
                height: '100%',
                width: 'auto',
            }} />
        </div>
    )
}
