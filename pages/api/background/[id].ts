import {NextApiRequest, NextApiResponse} from "next";
import {getYiqiBackground} from "@/api/yiqiBackground/service";
import {verifyBackgroundExists} from "@/api/provider/service";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query;

    try {
        await verifyBackgroundExists(+id!)
        const jsonResponse = await getYiqiBackground(+id!)
        res.status(200).json(jsonResponse)
    } catch (error: any) {
        console.log(error)
        res.status(400).json({error: error.message})
    }

}