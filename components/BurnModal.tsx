import {useContext, useEffect, useState} from "react";
import {useMoralis} from "react-moralis";
import {AppContext} from "../contexts/AppConfig";
import {getCurveContract, getYiqiContract, getYiqiTreasuryContract} from "@/ethersHelper";
import {useNotification} from "web3uikit";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from '@chakra-ui/react'
import {ethers} from "ethers";
import {DEFAULT_SLIPPAGE} from "../constants/configHelper";
import BurnButton from "./BurnButton";
import {round} from "@popperjs/core/lib/utils/math";

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
        if (!isWeb3Enabled || appContext?.isConnectedToCorrectChain)
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

        const minAmountOut = expectedAmountOut * BigInt(round(100000 - slippage * 1000)) / BigInt(100000);
        setMinAmountOut(minAmountOut);
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
                        <NumberInput defaultValue={DEFAULT_SLIPPAGE} min={0} max={50} precision={1} step={0.1} size='md' maxW={24} clampValueOnBlur={false}>
                            <NumberInputField value={slippage} onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setSlippage(+ev.target.value)} />
                        </NumberInput>
                        <div>Min amount out: {minAmountOut ? minAmountOut.toString() : "Loading..."}</div>
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