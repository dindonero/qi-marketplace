import {FaComment, FaFire, FaHeart, FaStar} from 'react-icons/fa';
import {Box, Flex, ListItem, UnorderedList} from "@chakra-ui/react";
import {GiCrystalBall} from "react-icons/gi";


const HomepageInfoModal = () => {
    return (
        <Box display="flex" flexDirection="column" p='10'>
            <Flex alignItems={"center"} justifyContent={"space-evenly"}>
                <div style={{width: "30%"}}>
                    <FaHeart size="3em"/>
                    <span>Qi, inspired by Feng Shui and the Chinese Zodiac, is a unique NFT project that blends the artistry of tokenized assets with DeFi mechanics. When you mint a Yiqi NFT, you{"'"}ll receive two tokens, a unique Avatar and a Background, each drawn from an extensive and beautifully crafted collection. These represent the Chinese Zodiac and Feng Shui symbols, each with their own qualities and traits.</span>
                </div>
                <div style={{width: "30%"}}>
                    <FaStar size="3em"/>
                    <span>A treasury system has been established that benefits NFT holders. Whenever an NFT is minted or a secondary sale occurs, the respective fees are deposited into the treasury, contributing to its growth. The treasury{"'"}s balance is then converted into liquid staked ETH (stETH), a yield-generating asset. This process creates a treasury value proportional to the outstanding NFTs. If a user decides to burn their NFT, they can redeem a proportional share of the treasury{"'"}s value. However, a 5% burn fee is applied to incentivize holding your NFTs, which is then deposited back into the treasury. This system creates a self-sustaining economic model that not only benefits the NFT holders but also aligns the interests of all parties involved in the project. Furthermore, 2% of the treasury{"'"}s annual yield is sent to the YAM Treasury, and another 2% is paid to the NFT Team to maintain project infrastructure.</span>
                </div>
                <div style={{width: "30%"}}>
                    <FaComment size="3em"/>
                    <span>With a fixed supply of 8888 NFTs, we provide an opportunity for everyone to get involved. Each mint will cost 0.1 ETH. Apart from providing you with a unique and beautiful digital asset, your mint fee contributes to the treasury, directly increasing the value of your NFT.</span>
                </div>
                <div style={{width: "30%"}}>
                    <FaFire size="3em"/>
                    <span>The burn functionality offers Qi NFT holders a unique mechanism to redeem value from their NFTs. It allows NFT holders to destroy, or {'"burn",'} their NFTs in exchange for a proportional value of the treasury. This burn feature essentially allows users to redeem the value of their NFT, minus a small 5% fee that is left in the treasury. This fee discourages continuous and repetitive minting and burning, thus promoting stability in the NFT ecosystem of the project. The burn feature provides an exit strategy for NFT holders, making the Qi NFT project a dynamic and liquid NFT marketplace.</span>
                </div>
                <div style={{width: "30%"}}>
                    <GiCrystalBall size="3em"/>
                    <span>Feng Shui symbols play an integral role in the Qi NFT project. They form the themes for the NFTs and are divided into five categories, each representing different aspects of life to promote or attract. These categories and their symbols are:</span>
                    <UnorderedList>
                        <ListItem>Prosperity and Financial Success: Chinese Dragon, Koi Fish, Money Frog, Three-Legged Toad, Pi Xiu, Pi Yao, and Peony.</ListItem>
                        <ListItem>Balance and Harmony: Chinese Phoenix, Yin Yang Symbol, Bagua, and The Five Elements.</ListItem>
                        <ListItem>Stability, Protection, and Long Life: Tortoise, Pagoda, Chinese Fu Dog, and Chinese Bagua Mirror.</ListItem>
                        <ListItem>Positive Energy and Good Luck: Jade, Lucky Bamboo, Laughing Buddha, and Jade Tree.</ListItem>
                        <ListItem>Love and Happiness in Relationships: Double Happiness Symbol, Mandarin Ducks, Rose Quartz, Lotus, and Peach Blossom.</ListItem>
                    </UnorderedList>
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
