import {Box, Flex, Text, Heading, Image, Button} from "@chakra-ui/react";
import {useEffect, useState, useRef} from "react";
import HomepageInfoModal from "../components/HomepageInfoModal";
import {requestNFTMetadata, requestNFTMetadataBackend} from "@/nftMetadata/fetchMetadata";
import {useSpring, animated, config, useTrail} from 'react-spring';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Home = () => {
    const ref = useRef<null | HTMLDivElement>(null);
    const backgroundImage = "/images/home9.jpg";
    const backgroundImage2 = "/images/home10.jpg";
    const [artwork, setArtwork] = useState<string[]>([]);

    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        ref.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
    };

    function importAll(r:any) {
        return r.keys().map(r);
      }

    const getArtworkImages = async () => {
        const images = importAll(require.context("../public/images/mintLoading/", true));

        let art: string[] = [];

        try {
            images.forEach((ID:any) => {
                art.push(ID.default.src);
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


    return (
        <>
            <Box
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "left",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed",
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

                    <Button colorScheme="blue" size="lg" onClick={handleClick}>
                        Learn More
                    </Button>
                </Flex>
            </Box>
            <Box marginRight='10%' marginLeft='10%' ref={ref} scrollMarginTop="5vh">
                <HomepageInfoModal />
            </Box>
            <Box
                style={{
                    backgroundImage: `url(${backgroundImage2})`,
                    backgroundSize: "cover",
                    backgroundPosition: "top",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed",
                    width: "100%",
                    height: "100vh",
                    color: "white",
                }}
            ></Box>
            <Box p={10}>
                <Slider {...settings} >
                    {artwork.map((image, index) => {
                        return (
                            <div
                                key={index}>
                                    <img src={image} alt="nft" style={{
                                        borderRadius: "2vw",
                                        margin: "0 50px",
                                        objectFit: "cover",
                                        width: "70%",
                                    }}/>
                            </div>
                        )
                    }
                    )}
                </Slider>
            </Box>

        </>
    );
}

export default Home;
