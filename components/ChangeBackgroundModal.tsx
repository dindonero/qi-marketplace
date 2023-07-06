import {NextPage} from "next";
import {useMoralis} from "react-moralis";
import {Alchemy, Network} from "alchemy-sdk";
import {requestBackgroundMetadataBackend, requestNFTMetadataBackend} from "@/nftMetadata/fetchMetadata";
import {useEffect, useState} from "react";
import networkMapping from "../constants/networkMapping.json";
import {CHAIN_ID} from "../constants/configHelper";
import {
    Stack,
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, useDisclosure,
} from '@chakra-ui/react'
import ChangeBackgroundButton from "./ChangeBackgroundButton";
import Image from "next/image";
import {getTokenIdsOwnedByUser} from "@/nftMetadata/alchemyConnector";
import {useRouter} from "next/router";
import ChangeBackgroundBox from "./ChangeBackgroundBox";
import PreviewBackgroundChangeModal from "./PreviewBackgroundChangeModal";

interface ChangeBackgroundModalProps {
    tokenId: string;
}

const ChangeBackgroundModal = (props: ChangeBackgroundModalProps) => {

    const {isWeb3Enabled, account} = useMoralis()

    const {isOpen, onOpen, onClose} = useDisclosure();

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


    useEffect(() => {
        if (isWeb3Enabled)
            fetchOwnedBackgrounds()
    }, [])


    return (
        <>
            <Stack direction={{base: 'column', md: 'row'}} style={{"overflowY": "scroll", height: "50vh", width: "90%"}}>
                {isFetchingNfts ? (
                        <div>Loading...</div>
                    ) : (
                        isEmpty(nftsJsonMetadata) ? (
                            <div>No Backgrounds Owned</div>
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                {Object.keys(nftsJsonMetadata).map((i) => {
                                    return (
                                        <ChangeBackgroundBox key={i}
                                            tokenId={nftsJsonMetadata[i].yiqi_background_id.toString()}
                                            tokenJsonMetadata={nftsJsonMetadata[i]}
                                            onSelectBackground={(backTokenId: string | undefined) => setSelectedBackground(backTokenId)}
                                            selectedBackgroundTokenId={selectedBackground}/>
                                    )
                                })}
                            </div>
                        )
                    )
                }
            </Stack>
                    {/* <ModalHeader>Select a background</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button isDisabled={!selectedBackground} onClick={onOpen} colorScheme='blue' mr={3}>
                            Change Background
                        </Button>
                        <Button colorScheme='blue' mr={3} onClick={props.onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Box> */}
            {
                selectedBackground ?
                    <PreviewBackgroundChangeModal isOpen={isOpen} onClose={onClose} tokenId={props.tokenId}
                                                  backgroundTokenId={selectedBackground}/>
                    : <></>
            }
        </>
    )

}

export default ChangeBackgroundModal;
