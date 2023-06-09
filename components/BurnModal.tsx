import {useContext, useEffect, useState} from "react";
import {useMoralis} from "react-moralis";
import {AppContext} from "../contexts/AppConfig";
import {getCurveContract, getYiqiTreasuryContract} from "@/ethersHelper";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberInput,
    NumberInputField,
} from '@chakra-ui/react'
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

    const {isWeb3Enabled, chainId} = useMoralis();

    const [minAmountOut, setMinAmountOut] = useState<BigInt | undefined>();
    const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE);


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
    }

    return (
        <>
            <Modal isOpen={props.isOpen} onClose={props.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Burn Yiqi</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div>Slippage tolerance</div>
                        <NumberInput defaultValue={DEFAULT_SLIPPAGE} min={MIN_SLIPPAGE} max={MAX_SLIPPAGE} precision={1} step={0.1} size='md' maxW={24}>
                            <NumberInputField value={slippage} onChange={(ev: React.ChangeEvent<HTMLInputElement>) => handleSlippage(+ev.target.value)} />
                        </NumberInput>
                        <div>Min amount out: {minAmountOut ?  ethers.formatEther(minAmountOut.toString()).substring(0, 9) + " ETH" : "Loading..."}</div>
                    </ModalBody>
                    <ModalFooter>
                        <BurnButton tokenId={props.tokenId} minAmountOut={minAmountOut} />
                        <Button colorScheme='blue' mr={3} onClick={props.onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )

}

export default BurnModal;