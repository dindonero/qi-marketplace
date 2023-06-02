import BurnModal from "../components/BurnModal";
import {Button, useDisclosure} from "@chakra-ui/react";

const Burn = () => {
    const backgroundImage = "/images/home11.jpg";

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <div style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "left",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
        }}
        >
            <h1 className="font-bold text-5xl">Burn NFTs</h1>
            <Button onClick={onOpen}>Burn</Button>
            <BurnModal isOpen={isOpen} onClose={onClose} tokenId={0} /> {/* todo tokenId */}

        </div>
    );
}

export default Burn