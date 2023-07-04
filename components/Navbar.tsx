import {ConnectButton} from "web3uikit";
import {MintButton} from "./MintButton";
import NetworkBanner from "./NetworkBanner"
import {useRouter} from 'next/router';
import {ReactNode} from "react";
import {
    Box,
    Flex,
    Avatar,
    HStack,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    useBreakpointValue
} from "@chakra-ui/react";
import {HamburgerIcon, CloseIcon, AddIcon} from "@chakra-ui/icons";
import Link from "next/link";
// import { ColorModeSwitcher } from "./ColorModeSwitcher";
// const Links = ["Dashboard", "Projects", "Team"];
import navStyles from "./navbar.module.css";
import {integer} from "aws-sdk/clients/frauddetector";

const Links = [
    {
        name: "HOME",
        path: "/",
    },
    // {
    //   name: "MINT A YIQI",
    //   path: "/mint",
    // },
    {
        name: "YOUR YIQIS",
        path: "/yiqis",
    },
    {
        name: "BACKGROUNDS",
        path: "/backgrounds",
    },
    {
        name: "GALLERY",
        path: "/gallery",
    }
];


export default function Navbar() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const router = useRouter();

    const isActive = (pathname: string) => {
        return router.pathname === pathname || pathname === "/yiqis" &&  router.pathname.includes("NFTDisplay");
    };

    const NavLink = ({children, path}: { children: ReactNode; path: string }) => (
        <Box
            px={4}
            py={2}
            rounded={"md"}
            _hover={{
                color: "gray.900",
                textDecoration: "none",
                bg: useColorModeValue("gray.200", "gray.700"),
            }}
            className={isActive(path) ? 'font-bold' : ''}
            color={isActive(path) ? 'rgb(46, 125, 175)' : 'gray.100'}
        >
            <Link href={path}>
                {children}
            </Link>
        </Box>
    );

    return (
        <div className={navStyles.mobileNav}>
            <Box bg={"gray.900"} px={4}>
                <Flex h={16} alignItems={"center"} justifyContent={"space-evenly"} pos="sticky"> {/*add margin mx */}
                    <IconButton
                        size={"md"}
                        icon={isOpen ? <CloseIcon/> : <HamburgerIcon/>}
                        aria-label={"Open Menu"}
                        display={{md: "none"}}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <Flex alignItems={"center"}>
                        {/* <img src="./images/logo2.png" alt="logo" width="10%"/> */}
                        <Box color="rgb(46, 125, 175)">Logo</Box>
                    </Flex>
                    <HStack
                        as={"nav"}
                        spacing={10}
                        display={{base: "none", md: "flex"}}
                    >
                        {Links.map(({name, path}) => (
                            <NavLink key={path} path={path}>
                                {name}
                            </NavLink>
                        ))}
                    </HStack>
                    <Flex alignItems={"center"}>
                        <Flex display={{base: "none", md: "flex"}}><NetworkBanner/></Flex>
                        <ConnectButton moralisAuth={false}/>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{md: "none"}}>
                        <Stack as={"nav"} spacing={4}>
                            {Links.map(({name, path}) => (
                                <NavLink key={path} path={path}>
                                    {name}
                                </NavLink>
                            ))}
                        </Stack>
                        {/* <MintButton/> */}
                        <Flex px={4} py={4}><NetworkBanner/></Flex>
                    </Box>
                ) : null}
            </Box>
        </div>
    );
}