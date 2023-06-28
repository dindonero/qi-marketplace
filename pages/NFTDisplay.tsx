import {useEffect, useState} from "react";
import {useMoralis} from "react-moralis";
import {useRouter} from "next/router";
import BurnModal from "../components/BurnModal";
import ChangeBackgroundModal from "../components/ChangeBackgroundModal";
import {Stack, Box, Button, useDisclosure, Flex, ButtonGroup} from "@chakra-ui/react";
import OpenseaButton from "../components/OpenseaButton";
import {requestBackgroundMetadata, requestTransparentURL} from "@/nftMetadata/fetchMetadata";
import AddressDisplayComponent from "../components/AddressDisplayComponent";
import {getYiqiNFTOwner} from "@/ethersHelper";
import MetadataDropdown from "../components/MetadataDropdown";
import ChangeBackgroundButton from "../components/ChangeBackgroundButton";
import ChangeBackgroundBox from "../components/ChangeBackgroundBox";
import {getTokenIdsOwnedByUser} from "@/nftMetadata/alchemyConnector";
import {requestBackgroundMetadataBackend} from "@/nftMetadata/fetchMetadata";
import networkMapping from "../constants/networkMapping.json";
import {CHAIN_ID} from "../constants/configHelper";
import Image from "next/image"
import {Card} from "web3uikit"

export default function NFTDisplay() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    // const [isOpenBurnModal, SetisOpenBurnModal] = useState<boolean>(true);

    const {isWeb3Enabled, account} = useMoralis()
    const router = useRouter();
    const tokenId = +router.query.tokenId!;

    const [transparentImage, setTransparentImage] = useState<string | null>(null);
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [ownerAddress, setOwnerAddress] = useState<string | undefined>(undefined);
    const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(true);

    const loadImages = async () => {
        setIsLoadingPreview(true);
        const transparentUrl = await requestTransparentURL(tokenId);

        const transparentJSON = await transparentUrl.json();

        const tokenOwner = await getYiqiNFTOwner(tokenId);

        setOwnerAddress(tokenOwner);
        setTransparentImage(transparentJSON.image);
        setBackgroundImage(transparentJSON.background);
        setIsLoadingPreview(false);
    }

    const [nftsJsonMetadata, setNftsJsonMetadata] = useState<any>({})
    const [isFetchingNfts, setIsFetchingNfts] = useState<boolean>(true)

    const [selectedBackground, setSelectedBackground] = useState<string | undefined>(undefined)

    const fetchNFTMetadata = async () => {
        const yiqiBackgroundAddress: string = networkMapping[CHAIN_ID].YiqiBackground[networkMapping[CHAIN_ID].YiqiBackground.length - 1]
        const tokenIds = await getTokenIdsOwnedByUser(account!, yiqiBackgroundAddress)
        const metadata = await requestBackgroundMetadataBackend(tokenIds)
        return Promise.all(Object.keys(metadata).map(async (tokenId: string) => {
            const response = await metadata[+tokenId]
            return await response.json()
        }));
    }

    const fetchOwnedBackgrounds = async () => {
        setIsFetchingNfts(true)
        const ownedNfts = await fetchNFTMetadata()
        setNftsJsonMetadata(ownedNfts)
        setIsFetchingNfts(false)
    }

    const isEmpty = (obj: any) => {
        return Object.keys(obj).length === 0;
    }


    const previewBackgroundChange = async (backgroundToken : any, image : any) => {
        setIsLoadingPreview(true);
        setSelectedBackground(backgroundToken);
        setBackgroundImage(image);
        setIsLoadingPreview(false);
    }

    useEffect(() => {
        if (router.isReady)
            loadImages();
    }, [router.isReady]);

    useEffect(() => {
        if (isWeb3Enabled)
            fetchOwnedBackgrounds()
    }, [])

    useEffect(() => {
        if (!isWeb3Enabled)
            router.push("/")
    }, [isWeb3Enabled])

    return backgroundImage ? (
        <Stack spacing={8} direction={{base: 'column', md: 'row'}} alignItems={"center"} justifyContent={"space-evenly"} p='10' marginLeft="5%">
            {/* {transparentImage ? <img src={image?.toString()} alt="Foreground" style={{
                borderRadius: "1vw",
                objectFit: "contain",
                width: "40%"
                // mixBlendMode: "hard-light"
            }}/> : <></>} */}
            {!isLoadingPreview ? (
                <Box>
                    <div style={{
                        position: 'relative',
                        width: "70vh",
                    }}>
                        <img src={backgroundImage!} alt="Background"
                                style={{position: 'relative', top: 0, borderRadius: "1vw"}}/>
                        <img src={transparentImage!} alt="Foreground"
                                style={{position: 'absolute', top: 0}}/>
                    </div>
                    {selectedBackground ? <Box py='5'>
                        <ChangeBackgroundButton tokenId={String(tokenId)}
                            backgroundTokenId={String(selectedBackground)}/>
                    </Box> : <></>}
                    
                </Box>
                    
                ) : (
                    <div>Loading...</div>
                )
            }
            {!isLoadingPreview ? (<Stack direction='column' >
                <Stack spacing={8} direction={{base: 'column', md: 'row'}} style={{color: "white"}}>
                    <Box
                        borderWidth='1px' borderRadius='lg'
                        p='10'
                        display="flex"
                        flexDirection="column"
                        gap={5}
                        bg='gray.600'
                    >
                        <h1 style={{ fontSize: "1.3rem" }}>Token ID #{tokenId}</h1>
                        <AddressDisplayComponent address={ownerAddress} />
                        <ButtonGroup gap='5'>
                            <Button
                                onClick={() => {
                                    onOpen();
                                }}
                                colorScheme="red"
                                _hover={{ bg: 'red.700' }}
                            >
                                Burn
                            </Button>
                            <OpenseaButton
                                tokenId={tokenId.toString()}
                                isBackground={false}
                            />
                        </ButtonGroup>
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
                <Stack direction={{base: 'column', md: 'row'}} style={{"overflowY": "scroll", height: "50vh", width: "90%"}}>
                    {isFetchingNfts ? (
                            <div>Loading...</div>
                        ) : (
                            isEmpty(nftsJsonMetadata) ? (
                                <div>No Backgrounds Owned</div>
                            ) : (
                                <Box
                                    py='5'
                                >
                                <h1 style={{ fontSize: "1.2rem" }}>Select Background: </h1><br></br>
                                <div className="flex flex-wrap gap-4">
                                    {Object.keys(nftsJsonMetadata).map((i) => {
                                        return (
                                            <div key={i}>
                                                <Card
                                                    title={`Yiqi #${nftsJsonMetadata[i].yiqi_background_id.toString()}`}
                                                    onClick={() => previewBackgroundChange(nftsJsonMetadata[i].yiqi_background_id.toString(), nftsJsonMetadata[i].image)}
                                                    isSelected={selectedBackground !== null ? selectedBackground === nftsJsonMetadata[i].yiqi_background_id.toString() : false}
                                                >
                                                    <div className="flex flex-col items-end gap-2 p-2">
                                                        <div>#{nftsJsonMetadata[i].yiqi_background_id.toString()}</div>
                                                        <Image
                                                            alt={`Background #${nftsJsonMetadata[i].yiqi_background_id.toString()}`}
                                                            loader={() => nftsJsonMetadata[i].image}
                                                            src={nftsJsonMetadata[i].image}
                                                            height="250"
                                                            width="250"
                                                        />
                                                    </div>
                                                </Card>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Box>
                            )
                        )
                    }
                    </Stack>
                </Stack>) : <></>}
        </Stack>
    ) : (<></>)
}
