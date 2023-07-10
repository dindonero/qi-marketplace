import {getTransparentURL, getYiqiNFT} from "@/api/yiqiNFT/service";

import {NextApiRequest, NextApiResponse} from "next";
import {verifyYiqiNFTExists} from "@/api/provider/service";
import {yiqiNFTExistsInDb} from "@/api/yiqiNFT/db.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    const tokenId = +id!

    try {
        await verifyYiqiNFTExists(tokenId)
        if (!(await yiqiNFTExistsInDb))
            await getYiqiNFT(tokenId) // creates nft if it doesn't exist
        const jsonResponse = await getTransparentURL(tokenId)
        res.status(200).json(jsonResponse)
    } catch (error: any) {
        console.log(error)
        res.status(400).json({error: error.message})
    }
}