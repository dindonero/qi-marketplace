import {NextApiRequest, NextApiResponse} from "next";
import {getQiBackground} from "@/qiBackground/service";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query;

    const tokenId = +id!

    try {
        const jsonResponse = await getQiBackground(tokenId)
        res.status(200).json(jsonResponse)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({error: error.message})
    }

}