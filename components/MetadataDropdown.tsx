import {useEffect, useState} from "react";
import {Button, Collapse, Flex, Text} from "@chakra-ui/react";
import {requestNFTMetadata} from "@/nftMetadata/fetchMetadata";

interface MetadataDropdownProps {
    tokenId: string;
}

type Metadata = {
    trait_type: string;
    value: string;
}
const MetadataDropdown = (props: MetadataDropdownProps) => {

    const [metadata, setMetadata] = useState<Metadata[] | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const getMetadata = async () => {
        const metadata = await requestNFTMetadata(+props.tokenId);
        const metadataJSON = await metadata.json();
        setMetadata(metadataJSON.attributes);
    }

    useEffect(() => {
        getMetadata();
    }, [])

    return (
        <>
            <Button size='sm' onClick={() => setIsOpen(!isOpen)} mt='1rem'>
                {isOpen ? 'Hide' : 'Show'} attributes
            </Button>
            <Collapse startingHeight={20} in={isOpen}>
                {
                    metadata?.map((attribute) => {
                        return (
                            <Flex key={attribute.trait_type} style={{marginTop: '1rem'}} alignItems={"center"} justifyContent={"space-evenly"}>
                                <Text className="text-xs uppercase tracking-widest text-white/60" style={{fontWeight: 'bold'}} marginRight={5}>{attribute.trait_type}</Text>
                                <Text className="text-right">{attribute.value}</Text>
                            </Flex>
                        )
                    })
                }
            </Collapse>
        </>
    )

}

export default MetadataDropdown;