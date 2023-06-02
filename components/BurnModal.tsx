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

interface BurnModalProps {
    isOpen: boolean;
    onClose: () => void;
    tokenId: number;
}
const BurnModal = (props: BurnModalProps) => {

    const appContext = useContext(AppContext);
    const dispatch = useNotification();

    const {isWeb3Enabled, chainId} = useMoralis();

    const [minAmountOut, setMinAmountOut] = useState<number | undefined>();
    const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE);

    const [isBurning, setIsBurning] = useState(false);


    useEffect(() => {
        if (!isWeb3Enabled || !appContext?.isConnectedToCorrectChain)
            return
        // Hack due to lack of Curve contract on goerli
        if (chainId === "5")
            setMinAmountOut(0)
        else
            getExpectedAmountOut()

    }, [isWeb3Enabled, appContext?.isConnectedToCorrectChain, chainId, slippage])

    const callBurnFunction = async () => {
        try {
            setIsBurning(true);

            const yiqiContract = await getYiqiContract();
            const burnTx = await yiqiContract.burn(props.tokenId, minAmountOut);

            const burnReceipt = await burnTx.wait(1);
            const decodedLog = yiqiContract.interface.parseLog(burnReceipt!.logs.slice(-1)[0])
            const ethReceived = decodedLog!.args.ethAmountReturned;
            const ethAmountReturnedInEther = ethers.formatEther(ethReceived);

            dispatch({
                type: "success",
                message: `Successfully burned Yiqi NFT and received ${ethAmountReturnedInEther} ETH`,
                title: "Minted NFT",
                position: "topR"
            })
        } catch (error: any) {
            console.error('Error calling contract function:', error);
            dispatch({
                type: "error",
                message: error.info?.error?.message ? error.info.error.message : "Yiqi Background burn failed",
                title: "NFT Burn Failed",
                position: "topR"
            })
        }
        setIsBurning(false);
    }

    const getExpectedAmountOut = async () => {
        const treasuryContract = await getYiqiTreasuryContract();
        const stEthReceived = await treasuryContract.calculateReclaimableStETHFromBurn();

        // Hack due to lack of Curve contract on goerli
        let expectedAmountOut;
        if (chainId !== "5") {
            const curveContract = await getCurveContract();
            expectedAmountOut = await curveContract.get_dy(1, 0, stEthReceived);
        } else {
            expectedAmountOut = stEthReceived;
        }

        const minAmountOut = expectedAmountOut.mul(1 - slippage / 100);
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
                        <NumberInput defaultValue={DEFAULT_SLIPPAGE} min={0} max={50} precision={1} step={0.1}>
                            <NumberInputField value={slippage} onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setSlippage(+ev.target.value)} />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </ModalBody>
                    <ModalFooter>
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