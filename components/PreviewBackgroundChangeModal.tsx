import {requestBackgroundMetadata, requestTransparentURL} from "@/nftMetadata/fetchMetadata";
import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";
import ChangeBackgroundButton from "./ChangeBackgroundButton";

interface PreviewBackgroundChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    tokenId: string;
    backgroundTokenId: string;
}

const PreviewBackgroundChangeModal = (props: PreviewBackgroundChangeModalProps) => {

    const [transparentImage, setTransparentImage] = useState<string | null>(null);
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(true);
    const previewBackgroundChange = async () => {
        setIsLoadingPreview(true);
        const backgroundMetadata = await requestBackgroundMetadata(+props.backgroundTokenId);
        const transparentUrl = await requestTransparentURL(+props.tokenId);

        const backgroundJSON = await backgroundMetadata.json();
        const transparentJSON = await transparentUrl.json();

        console.log(isLoadingPreview)

        setTransparentImage(transparentJSON.image);
        setBackgroundImage(backgroundJSON.image);
        setIsLoadingPreview(false);
    }

    useEffect(() => {
        previewBackgroundChange();
    }, [props.backgroundTokenId]);


    return (
        <>
            <Modal isOpen={props.isOpen} onClose={props.onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Preview Selection</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {!isLoadingPreview ? (
                            <div style={{
                                position: 'relative',
                                width: "100%",
                                height: "40vh"
                            }}>
                                <img src={backgroundImage!} alt="Background"
                                     style={{position: 'absolute', width: '100%', height: 'auto'}}/>
                                <img src={transparentImage!} alt="Foreground"
                                     style={{position: 'absolute', width: '100%', height: 'auto'}}/>
                            </div>
                        ) : (
                            <div>Loading...</div>
                        )
                        }
                    </ModalBody>
                    <ModalFooter>
                        <ChangeBackgroundButton tokenId={String(props.tokenId)}
                                                backgroundTokenId={props.backgroundTokenId}/>
                        <Button colorScheme='blue' mr={3} onClick={props.onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )

}

export default PreviewBackgroundChangeModal;
