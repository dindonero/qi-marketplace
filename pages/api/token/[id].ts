import {NextApiRequest, NextApiResponse} from "next";
import {imageMerge} from "@/image-merge/service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    const resolvedData = +id! + 1

    await imageMerge()

    res.status(200).json(resolvedData)
}