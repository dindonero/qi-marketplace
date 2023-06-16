import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import BurnModal from "../components/BurnModal";
import ChangeBackgroundModal from "../components/ChangeBackgroundModal";
import {Box, Button, useDisclosure, Flex} from "@chakra-ui/react";
import OpenseaButton from "../components/OpenseaButton";
import {requestBackgroundMetadata, requestTransparentURL} from "@/nftMetadata/fetchMetadata";
import AddressDisplayComponent from "../components/AddressDisplayComponent";
import {getYiqiNFTOwner} from "@/ethersHelper";
import MetadataDropdown from "../components/MetadataDropdown";

export default function NFTDisplay() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const router = useRouter();
    const tokenId = +router.query.tokenId!;

    const [isOpenBurnModal, SetisOpenBurnModal] = useState<boolean>(true);

    const [transparentImage, setTransparentImage] = useState<string | null>(null);
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [ownerAddress, setOwnerAddress] = useState<string | undefined>(undefined);

    const loadImages = async () => {

        const transparentUrl = await requestTransparentURL(tokenId);

        const transparentJSON = await transparentUrl.json();

        const tokenOwner = await getYiqiNFTOwner(tokenId);

        setOwnerAddress(tokenOwner);
        setTransparentImage(transparentJSON.image);
        setBackgroundImage(transparentJSON.background);
    }

    useEffect(() => {
        if (router.isReady)
            loadImages();
    }, [router.isReady]);

    return backgroundImage ? (
        <div style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100vh",
            position: "fixed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
        }}>
            {transparentImage ? <img src={transparentImage} alt="Foreground" style={{
                position: "fixed",
                objectFit: 'contain',
                height: '100%',
                width: 'auto',
                left: 100
            }}/> : <></>}
            <Box
                borderWidth='1px' borderRadius='lg'
                p='10'
                position="fixed"
                bottom={100}
                right={200}
                display="flex"
                flexDirection="column"
                gap={5}
                bg='gray.600'
            >
                <MetadataDropdown tokenId={tokenId.toString()} />
            </Box>
            <Box
                borderWidth='1px' borderRadius='lg'
                p='10'
                position="fixed"
                top={20}
                right={200}
                display="flex"
                flexDirection="column"
                gap={5}
                bg='gray.600'
            >
                <h1 style={{ fontSize: "1.3rem" }}>Token ID #{tokenId}</h1>
                <AddressDisplayComponent address={ownerAddress} />
                <Flex alignItems={"center"} justifyContent={"space-evenly"} h={16}>
                    <Button
                        onClick={() => {
                            SetisOpenBurnModal(false);
                            onOpen();
                        }}
                        colorScheme="blue"
                        _hover={{ bg: 'blue.700' }}
                        marginRight={5}
                    >
                        Change Background
                    </Button>
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
                </Flex>
                <OpenseaButton
                    tokenId={tokenId.toString()}
                    isBackground={false}
                />
            </Box>
            {isOpenBurnModal ?
                <BurnModal isOpen={isOpen} onClose={onClose} tokenId={String(tokenId)} />
                : <ChangeBackgroundModal isOpen={isOpen} onClose={onClose} tokenId={String(tokenId)} />
            }
        </div>
    ) : (<></>)
}
