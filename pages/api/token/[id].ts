import {NextApiRequest, NextApiResponse} from "next";
import {tokenService} from "@/token/service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    const resolvedData = +id!

    try {
        const jsonResponse = await tokenService(resolvedData)
        res.status(200).json(jsonResponse)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({error: error.message})
    }
}