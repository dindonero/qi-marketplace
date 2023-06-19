import { FaHeart, FaStar, FaComment } from 'react-icons/fa';
import {Box, Flex, Text, Heading, Image, Button} from "@chakra-ui/react";


const HomepageInfoModal = () => {
    return (
        <Box display="flex" flexDirection="column" p='10'>
            <Flex alignItems={"center"} justifyContent={"space-evenly"}>
                <div style={{width: "30%"}}>
                    <FaHeart size="3em"/>
                    <span>At Yiqi, we have built an innovative DeFi ecosystem around our NFTs. When you mint a Yiqi NFT, you´ll receive two unique tokens, an Avatar and a Background, each drawn from an extensive and beautifully crafted collection. These represent the Chinese Zodiac and Feng Shui symbols, each with their own qualities and traits.</span>
                </div>
                <div style={{width: "30%"}}>
                    <FaStar size="3em"/>
                    <span>A treasury system has been established that benefits NFT holders. All minting fees and royalties are deposited into a treasury which can be withdrawn proportionally by burning your NFT. Additionally, a small 5% burn fee has been implemented to incentivize holding your NFTs. This means that as more NFTs are minted and traded, the value of the treasury grows.</span>
                </div>
                <div style={{width: "30%"}}>
                    <FaComment size="3em"/>
                    <span>With a fixed supply of 8888 NFTs, we provide an opportunity for everyone to get involved. Each mint will cost 0.1 ETH. Apart from providing you with a unique and beautiful digital asset, your mint fee contributes to the treasury, directly increasing the value of your NFT.</span>
                </div>
            </Flex>
      </Box>
        // <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size="xl">
        //     <ModalOverlay />
        //     <ModalContent bg="white" color="black">
        //         <ModalHeader>About the Yiqi NFT Marketplace</ModalHeader>
        //         <ModalCloseButton />
        //         <ModalBody>
        //             <Text mb={2}>
        //                 At Yiqi, we have built an innovative DeFi ecosystem around our NFTs. When you mint a Yiqi NFT, you´ll receive two unique tokens, an Avatar and a Background, each drawn from an extensive and beautifully crafted collection. These represent the Chinese Zodiac and Feng Shui symbols, each with their own qualities and traits.
        //             </Text>
        //             <Text mb={2}>
        //                 A treasury system has been established that benefits NFT holders. All minting fees and royalties are deposited into a treasury which can be withdrawn proportionally by burning your NFT. Additionally, a small 5% burn fee has been implemented to incentivize holding your NFTs. This means that as more NFTs are minted and traded, the value of the treasury grows.
        //             </Text>
        //             <Text mb={2}>
        //                 With a fixed supply of 8888 NFTs, we provide an opportunity for everyone to get involved. Each mint will cost 0.1 ETH. Apart from providing you with a unique and beautiful digital asset, your mint fee contributes to the treasury, directly increasing the value of your NFT.
        //             </Text>
        //         </ModalBody>
        //         <ModalFooter>
        //             <Button colorScheme="purple" onClick={props.onClose}>
        //                 Close
        //             </Button>
        //         </ModalFooter>
        //     </ModalContent>
        // </Modal>
    )
}

export default HomepageInfoModal;
