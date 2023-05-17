import {NextApiRequest, NextApiResponse} from "next";
import {verifySignature, verifyYiQiBackgroundOwnership, verifyYiQiOwnership} from "@/provider/service";
import {changeBackground} from "@/change-background/service";

export default async function index(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {ethereumAddress, tokenId, backgroundTokenId, signature} = req.body;

    // Verify that the provided signature matches the Ethereum address
    const message = `Sign this message to authorize the following operation:
- Operation: Change YiQi background
- Ethereum address: ${ethereumAddress}
- Token ID: ${tokenId}
- New background token ID: ${backgroundTokenId}
`;
    try {
        await verifySignature(message, signature, ethereumAddress);
        await verifyYiQiOwnership(tokenId, ethereumAddress);
        await verifyYiQiBackgroundOwnership(backgroundTokenId, ethereumAddress);

        await changeBackground(tokenId, backgroundTokenId);

        res.status(200).send("Success");
    } catch (error: any) {
        console.log(error);
        res.status(400).json({error: error.message});
    }
}