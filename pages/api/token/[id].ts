import {NextApiRequest, NextApiResponse} from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    const resolvedData = +id! + 1

    res.status(200).json(resolvedData)
}