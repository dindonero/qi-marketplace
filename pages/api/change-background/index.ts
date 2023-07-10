import {NextApiRequest, NextApiResponse} from "next";
import {verifySignature, verifyYiqiBackgroundOwnership, verifyYiqiOwnership} from "@/api/provider/service";
import {changeBackground} from "@/api/change-background/service";
import {CHANGE_BACKGROUND_MESSAGE} from "../../../constants/configHelper";
import {ethers} from "ethers";

export default async function index(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {account, tokenId, backgroundTokenId, signature} = JSON.parse(req.body);

    // Verify that the provided signature matches the Ethereum address
    const message = CHANGE_BACKGROUND_MESSAGE(account, tokenId, backgroundTokenId);

    const address = ethers.getAddress(account);

    try {
        await verifySignature(message, signature, address);
        await verifyYiqiOwnership(tokenId, address);
        await verifyYiqiBackgroundOwnership(backgroundTokenId, address);

        const response = await changeBackground(tokenId, backgroundTokenId);

        res.status(200).send({status: response});
    } catch (error: any) {
        console.log(error);
        res.status(400).json({error: error.message});
    }
}