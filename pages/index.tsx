import {Box, Flex, Text, Heading, Image, Button} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import HomepageInfoModal from "../components/HomepageInfoModal";
import {requestNFTMetadata, requestNFTMetadataBackend} from "@/nftMetadata/fetchMetadata";
import {useSpring, animated, config, useTrail} from 'react-spring';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Home = () => {

    const backgroundImage = "/images/home9.jpg";
    const backgroundImage2 = "/images/home10.jpg";
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

    var settings = {
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 3000,
        autoplaySpeed: 3000,
        cssEase: "linear",
        responsive: [
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };


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
                        Yiqi NFT Marketplace
                    </Heading>

                    <Text fontSize="xl" align="center" mb={4} width={"50%"}>
                        Yiqi presents a unique collection of 8888 NFTs based on the Chinese Zodiac. Be part of an innovative
                        DeFi ecosystem that aligns your interests and provides benefits for all parties.
                    </Text>

                    <Button colorScheme="blue" size="lg" onClick={() => setIsOpen(!isOpen)}>
                        Learn More
                    </Button>
                </Flex>
                {/* <HomepageInfoModal isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}/> */}
            </Box>
            <Box marginRight='10%' marginLeft='10%'>
                <HomepageInfoModal />
            </Box>
            {/* <Box
                style={{
                    backgroundImage: `url(${backgroundImage2})`,
                    backgroundSize: "cover",
                    backgroundPosition: "left",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "100vh",
                    color: "white",
                }}
            ></Box>  */}
            
            <Box marginRight='10%' marginLeft='10%'>
                <Slider {...settings} >
                    {artwork.map((image, index) => {
                        return (
                            <div
                                key={index}>
                                    <img src={image} alt="nft" style={{
                                        borderRadius: "2vw",
                                        margin: "0 50px",
                                        objectFit: "cover",
                                        width: "80%",
                                    }}/>
                            </div>
                        )
                    }
                    )}
                </Slider>
            </Box>
        
            {/*NFT Artwork */}
            {/* <Box bg="white">
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
            </Box> */}

            {/* <Box
                style={{
                    backgroundImage: `url(${backgroundImage2})`,
                    backgroundSize: "cover",
                    backgroundPosition: "left",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "100vh",
                    color: "white",
                }}
            ></Box> */}

        </>
    );
}

export default Home;
