import {Box, Flex, Text, Heading, Image, Button} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import HomepageInfoModal from "../components/HomepageInfoModal";
import {requestNFTMetadata, requestNFTMetadataBackend} from "@/nftMetadata/fetchMetadata";
import {useSpring, animated, config, useTrail} from 'react-spring';

const Home = () => {

    const backgroundImage = "/images/home9.jpg";
    const [artwork, setArtwork] = useState<string[]>([]);

    const [isOpen, setIsOpen] = useState(false);

    const getArtworkImages = async () => {
        const tokenIds = Array.from(Array(10).keys())

        const tokenResponses = await requestNFTMetadataBackend(tokenIds);
        const tokenMetadatas = await Promise.all(Object.values(tokenResponses))
        const tokenMetadatasJSON = await Promise.all(tokenMetadatas.map((metadata) => metadata.json()));

        let art: string[] = [];

        try {
            tokenMetadatasJSON.forEach((metadata) => {
                const image = metadata.image;
                if (image)
                    art.push(image);
            })
        } catch {}
        setArtwork(art);
    }

    useEffect(() => {
        getArtworkImages();
    }, [])


    const scrolling = useSpring({
        from: { transform: 'translate3d(0%,0,0)' },
        to: async (next, cancel) => {
            await next({transform: `translate3d(-100%,0,0)`}),
            await next({transform: `translate3d(-200%,0,0)`}),
            await next({transform: `translate3d(-300%,0,0)`}),
            await next({transform: `translate3d(-400%,0,0)`}),
            await next({transform: `translate3d(-500%,0,0)`}),
            await next({transform: `translate3d(-600%,0,0)`}),
            await next({transform: `translate3d(-700%,0,0)`}),
            await next({transform: `translate3d(-800%,0,0)`})
        },
        config: config.slow,
        reset: true,
        loop: true
    });

    const trails = useTrail(artwork.length, {
        from: {opacity: 0},
        to: {opacity: 1},
        delay: 200,
    });

    return (
        <>
            <Box style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "left",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "auto",
                color: "white",
            }}>
                {/* Hero Section */}
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    minH="100vh"
                    p={10}
                    bgGradient="linear(to-b, rgba(0,0,0,0.6), rgba(0,0,0,0.6))"
                >
                    <Heading as="h1" size="4xl" fontWeight="bold" mb={6}>
                        Yiqi NFTs Marketplace
                    </Heading>
                    <Text fontSize="2xl" maxWidth="3xl" textAlign="center">
                        Qi (Chee) is a Feng Shui NFT project with a personalizable background...
                        {/* Truncated for brevity */}
                    </Text>
                </Flex>

                {/* NFT Artwork */}
                <Box bg="white" p={10}>
                    <Heading as="h2" size="2xl" mb={6}>NFT Artwork</Heading>
                    <div style={{display: 'flex', overflow: 'hidden'}}>
                        {trails.map((style, index) => (
                            <animated.img
                                key={artwork[index]}
                                src={artwork[index]}
                                alt={artwork[index]}
                                style={{...style, ...scrolling, width: '40%', height: 'auto'}}
                            />
                        ))}
                    </div>
                </Box>
            </Box>
            <Box
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "left",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "100vh",
                    color: "white",
                }}
            >
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    h="full"
                    p={8}
                >
                    <Heading as="h1" size="2xl" fontWeight="bold" mb={4}>
                        Welcome to Yiqi NFT Marketplace
                    </Heading>

                    <Text fontSize="xl" align="center" mb={4}>
                        Yiqi presents a unique collection of NFTs based on the Chinese Zodiac. Be part of an innovative
                        DeFi ecosystem that aligns your interests and provides benefits for all parties.
                    </Text>

                    <Button colorScheme="purple" size="lg" onClick={() => setIsOpen(!isOpen)}>
                        Learn More
                    </Button>
                </Flex>

                <HomepageInfoModal isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}/>
            </Box>
        </>
    );
}

export default Home;
