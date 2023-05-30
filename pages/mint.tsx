import { MintButton } from "../components/MintButton";
import {NextPage} from "next";

const Mint: NextPage = () => {
    return (
        <div>
            <h1 className="py-4 px-4 font-bold text-2xl">Mint a Yiqi</h1>
            <MintButton/>
        </div>
    )
}

export default Mint