import React, {useContext, useEffect, useState} from "react";
import {useMoralis} from "react-moralis";
import {AppContext} from "../contexts/AppConfig";
import {getCurveContract, getYiqiTreasuryContract} from "@/ethersHelper";
import {
    Box,
    Button,
    Heading,
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberInput,
    NumberInputField,
    Text,
    VStack,
} from '@chakra-ui/react';
import {CheckIcon, InfoIcon, SettingsIcon} from '@chakra-ui/icons';
import {DEFAULT_SLIPPAGE, MAX_SLIPPAGE, MIN_SLIPPAGE} from "../constants/configHelper";
import BurnButton from "./BurnButton";
import {ethers} from "ethers";

interface BurnModalProps {
    isOpen: boolean;
    onClose: () => void;
    tokenId: string;
}

const BurnModal = (props: BurnModalProps) => {
    const appContext = useContext(AppContext);
    const { isWeb3Enabled, chainId } = useMoralis();
    const [minAmountOut, setMinAmountOut] = useState<BigInt | undefined>();
    const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE);
    const [showInput, setShowInput] = useState<boolean>(false);

    useEffect(() => {
        if (!isWeb3Enabled || !appContext || !appContext!.isConnectedToCorrectChain)
            return
        // Hack due to lack of Curve contract on goerli
        if (chainId === "5")
            setMinAmountOut(BigInt(0))
        else
            getExpectedAmountOut()

    }, [isWeb3Enabled, appContext?.isConnectedToCorrectChain, chainId, slippage])

    const getExpectedAmountOut = async () => {
        const treasuryContract = await getYiqiTreasuryContract();
        const stEthReceived = await treasuryContract.calculateReclaimableStETHFromBurn();

        let expectedAmountOut;
        // Hack due to lack of Curve contract on goerli
        if (+chainId! !== 5) {
            const curveContract = await getCurveContract();
            expectedAmountOut = await curveContract.get_dy(1, 0, stEthReceived);
        } else {
            expectedAmountOut = stEthReceived;
        }

        const minAmountOut = expectedAmountOut * BigInt(Math.round(100000 - slippage * 1000)) / BigInt(100000);
        setMinAmountOut(minAmountOut);
    }

    const handleSlippage = (value: number) => {
        if (value < MIN_SLIPPAGE)
            value = MIN_SLIPPAGE
        else if (value > MAX_SLIPPAGE)
            value = MAX_SLIPPAGE
        setSlippage(value)
        setShowInput(false)
    }

    return (
        <>
            <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered closeOnOverlayClick={!showInput}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader color="red.500">
                        <Icon as={InfoIcon} mr="2" />
                        Burn Yiqi
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack align="start" spacing={5}>
                            <Text color="gray.500" mb={3}>
                                You are about to permanently burn your NFT. This action cannot be undone or reverted. In return, you will receive stETH, which will be automatically swapped for ETH and transferred to your wallet.
                            </Text>
                            <Box>
                                <Heading size="sm" color="blue.500">Minimum amount received:</Heading>
                                <Text>{minAmountOut ?  ethers.formatEther(minAmountOut.toString()).substring(0, 9) + " ETH" : "Loading..."}</Text>
                            </Box>
                            <Box>
                                <Heading size="sm" color="blue.500">Slippage tolerance:</Heading>
                                <HStack>
                                    {showInput ? (
                                        <>
                                            <NumberInput defaultValue={slippage} min={MIN_SLIPPAGE} max={MAX_SLIPPAGE} precision={1} step={0.1} size='sm'>
                                                <NumberInputField value={slippage} onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setSlippage(+ev.target.value)} />
                                            </NumberInput>
                                            <Button size="sm" onClick={() => handleSlippage(slippage)}><CheckIcon /></Button>
                                        </>
                                    ) : (
                                        <>
                                            <Text>{slippage}%</Text>
                                            <Button size="sm" onClick={() => setShowInput(true)}><SettingsIcon /></Button>
                                        </>
                                    )}
                                </HStack>
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <BurnButton tokenId={props.tokenId} minAmountOut={minAmountOut} isDisabled={showInput} />
                        <Button colorScheme='blue' mr={3} onClick={props.onClose} isDisabled={showInput}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default BurnModal;
