import {NextApiRequest, NextApiResponse} from "next";
import {getYiqiBackground} from "@/yiqiBackground/service";
import {verifyBackgroundExists} from "@/provider/service";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query;

    const tokenId = +id!

    try {
        await verifyBackgroundExists(tokenId)
        const jsonResponse = await getYiqiBackground(tokenId)
        res.status(200).json(jsonResponse)
    } catch (error: any) {
        console.log(error)
        res.status(400).json({error: error.message})
    }

}