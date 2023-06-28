import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import BurnModal from "../components/BurnModal";
import ChangeBackgroundModal from "../components/ChangeBackgroundModal";
import {Stack, Box, Button, useDisclosure, Flex} from "@chakra-ui/react";
import OpenseaButton from "../components/OpenseaButton";
import {requestBackgroundMetadata, requestTransparentURL} from "@/nftMetadata/fetchMetadata";
import AddressDisplayComponent from "../components/AddressDisplayComponent";
import {getYiqiNFTOwner} from "@/ethersHelper";
import MetadataDropdown from "../components/MetadataDropdown";

export default function NFTDisplay() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const router = useRouter();
    const tokenId = +router.query.tokenId!;
    const image = router.query.image;

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
        <Stack spacing={8} direction={{base: 'column', md: 'row'}} alignItems={"center"} justifyContent={"space-evenly"} p='10' >
            {transparentImage ? <img src={image?.toString()} alt="Foreground" style={{
                borderRadius: "1vw",
                objectFit: "contain",
                width: "40%"
                // mixBlendMode: "hard-light"
            }}/> : <></>}
            <Stack direction='column' >
                <Stack spacing={8} direction={{base: 'column', md: 'row'}} >
                    <Box
                        borderWidth='1px' borderRadius='lg'
                        p='10'
                        display="flex"
                        flexDirection="column"
                        gap={5}
                        bg='gray.600'
                        style={{color: "white"}}
                    >
                        <h1 style={{ fontSize: "1.3rem" }}>Token ID #{tokenId}</h1>
                        <AddressDisplayComponent address={ownerAddress} />
                        <Flex alignItems={"center"} justifyContent={"space-evenly"} h={16}>
                            <Button
                                onClick={() => {
                                    SetisOpenBurnModal(true);
                                    onOpen();
                                }}
                                colorScheme="red"
                                _hover={{ bg: 'red.700' }}
                                marginRight={5}
                            >
                                Burn
                            </Button>
                            <OpenseaButton
                                tokenId={tokenId.toString()}
                                isBackground={false}
                            />
                        </Flex>
                    </Box>
                    <BurnModal isOpen={isOpen} onClose={onClose} tokenId={String(tokenId)} />
                    <Box
                        borderWidth='1px' borderRadius='lg'
                        p='10'
                        display="flex"
                        flexDirection="column"
                        gap={5}
                        bg='gray.600'
                    >
                        <MetadataDropdown tokenId={tokenId.toString()} />
                    </Box>
                </Stack>
                <ChangeBackgroundModal tokenId={String(tokenId)}/>
            </Stack>
        </Stack>
    ) : (<></>)
}
