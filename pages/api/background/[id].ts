import {NextApiRequest, NextApiResponse} from "next";
import {getQiBackground} from "@/qiBackground/service";
import {changeBackground} from "@/change-background/service";
import {verifyBackgroundExists} from "@/provider/service";
import {getAllYiQiBaseFiles} from "@/qiNFT/db.service";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query;

    const tokenId = +id!

    try {
        await verifyBackgroundExists(tokenId)
        const jsonResponse = await getQiBackground(tokenId)
        res.status(200).json(jsonResponse)
    } catch (error: any) {
        console.log(error)
        res.status(400).json({error: error.message})
    }

}