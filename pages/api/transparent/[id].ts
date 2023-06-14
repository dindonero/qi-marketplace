import {getTransparentURL} from "@/api/yiqiNFT/service";

import {NextApiRequest, NextApiResponse} from "next";
import {verifyYiqiNFTExists} from "@/api/provider/service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    const tokenId = +id!

    try {
        await verifyYiqiNFTExists(tokenId)
        const jsonResponse = await getTransparentURL(tokenId)
        res.status(200).json(jsonResponse)
    } catch (error: any) {
        console.log(error)
        res.status(400).json({error: error.message})
    }
}