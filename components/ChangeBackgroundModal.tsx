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

interface ChangeBackgroundModalProps {
    isOpen: boolean;
    onClose: () => void;
    tokenId: string;
}

const ChangeBackgroundModal = (props: ChangeBackgroundModalProps) => {

    const {isWeb3Enabled, account} = useMoralis()

    const [listedNfts, setListedNfts] = useState<any>({})
    const [isFetchingNfts, setIsFetchingNfts] = useState<boolean>(true)

    const fetchNFTMetadata = async () => {
        const yiqiBackgroundAddress: string = networkMapping[CHAIN_ID].YiqiBackground[networkMapping[CHAIN_ID].YiqiBackground.length - 1]
        const tokenIds = await getTokenIdsOwnedByUser(account!, yiqiBackgroundAddress)
        return requestBackgroundMetadataBackend(tokenIds);
    }

    const fetchOwnedNfts = async () => {
        setIsFetchingNfts(true)
        const ownedNfts = await fetchNFTMetadata()
        setListedNfts(await Promise.all(Object.keys(ownedNfts).map(async (key) => {
            const nftResponse = await ownedNfts[+key]
            return await nftResponse.json()
        })))
        setIsFetchingNfts(false)
    }

    const isEmpty = (obj: any) => {
        return Object.keys(obj).length === 0;
    }

    async function updateUI() {
        await fetchOwnedNfts()
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled, account])

    return (
        <>
            <Modal isOpen={props.isOpen} onClose={props.onClose} size="full">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Select a background</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {/* <div className="bulkImageArea">
                        {bulkImages.map((img) => (
                            <img key={img} src={img} alt={img} className="bulkImage" />
                        ))}
                    </div> */}
                        {isFetchingNfts ? (
                            <div>Loading...</div>
                        ) : (
                            isEmpty(listedNfts) ? (
                                <div>No NFTs Owned</div>
                            ) : (
                                Object.keys(listedNfts).map((tokenId) => {
                                    return (
                                        <Image height="250"
                                               width="250" key={tokenId} loader={() => listedNfts[+tokenId].image}
                                               src={listedNfts[+tokenId].image} alt={listedNfts[tokenId].image}
                                               className="bulkImage"/>
                                    )
                                })
                            )
                        )
                        }
                    </ModalBody>
                    <ModalFooter>
                        <ChangeBackgroundButton tokenId={String(props.tokenId)} backgroundTokenId={"0"}/>
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