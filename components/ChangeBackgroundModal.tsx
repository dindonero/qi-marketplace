import {NextPage} from "next";
import {useMoralis} from "react-moralis";
import {Alchemy, Network} from "alchemy-sdk";
import {requestBackgroundMetadataBackend, requestNFTMetadataBackend} from "@/nftMetadata/fetchMetadata";
import {useEffect, useState} from "react";
import networkMapping from "../constants/networkMapping.json";
import {CHAIN_ID} from "../constants/configHelper";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react'
import ChangeBackgroundButton from "./ChangeBackgroundButton";
import Image from "next/image";
import {getTokenIdsOwnedByUser} from "@/nftMetadata/alchemyConnector";
import {useRouter} from "next/router";
import ChangeBackgroundBox from "./ChangeBackgroundBox";

interface ChangeBackgroundModalProps {
    isOpen: boolean;
    onClose: () => void;
    tokenId: string;
}

const ChangeBackgroundModal = (props: ChangeBackgroundModalProps) => {

    const {isWeb3Enabled, account} = useMoralis()

    const router = useRouter()

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
        console.log(ownedNfts)
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

    useEffect(() => {
        if (!isWeb3Enabled)
            router.push("/")
    }, [isWeb3Enabled])

    return (
        <>

            <Modal isOpen={props.isOpen} onClose={props.onClose} size="full" scrollBehavior="inside">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Select a background</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {isFetchingNfts ? (
                            <div>Loading...</div>
                        ) : (
                            isEmpty(nftsJsonMetadata) ? (
                                <div>No Backgrounds Owned</div>
                            ) : (
                                Object.keys(nftsJsonMetadata).map((i) => {
                                    return (
                                        <ChangeBackgroundBox key={i} tokenId={nftsJsonMetadata[i].yiqi_background_id.toString()}
                                                             tokenJsonMetadata={nftsJsonMetadata[i]}
                                                             onSelectBackground={(backTokenId: string | undefined) => setSelectedBackground(backTokenId)}
                                                             selectedBackgroundTokenId={selectedBackground}/>
                                    )
                                })
                            )
                        )
                        }
                    </ModalBody>
                    <ModalFooter>
                        <ChangeBackgroundButton tokenId={String(props.tokenId)}
                                                backgroundTokenId={selectedBackground}/>
                        <Button colorScheme='blue' mr={3} onClick={props.onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )

}

export default ChangeBackgroundModal;
