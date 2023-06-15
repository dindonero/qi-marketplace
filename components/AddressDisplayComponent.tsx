import React, {useState} from 'react';
import {Tooltip, IconButton, useClipboard, Flex} from "@chakra-ui/react";
import {CopyIcon} from "@chakra-ui/icons";


interface AddressDisplayComponentProps {
    address?: string;
}

export const AddressDisplayComponent = (props: AddressDisplayComponentProps) => {
    const {hasCopied, onCopy} = useClipboard(props.address!);
    const [isHovering, setIsHovering] = useState(false);

    const shortenAddress = (address: string, chars = 4) => {
        return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
    }

    const handleCopy = () => {
        onCopy();
        setIsHovering(false); // Hide tooltip immediately after copy
        setTimeout(() => setIsHovering(true), 500); // Show tooltip with "Copied!" after 500ms
    }

    return props.address ? (
        <Tooltip
            label={hasCopied ? "Copied!" : props.address}
            isOpen={isHovering}
        >
            <Flex>
                <div>
                    Owned by
                </div>
                <div
                    style={{
                        marginLeft: 5,
                        opacity: 1,
                        color: "rgb(148 227 220)",
                    }}
                    onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}
                    onClick={handleCopy}>
                    {shortenAddress(props.address)}
                </div>
            </Flex>
        </Tooltip>
    ) : (<></>)
}

export default AddressDisplayComponent;
