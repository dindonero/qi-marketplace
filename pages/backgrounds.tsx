import {NextPage} from "next";
import ListNFTs from "../components/ListNFTs";
import networkMapping from "../constants/networkMapping.json";
import {CHAINID} from "../constants/chainId";

const Backgrounds: NextPage = () => {

    const yiqiBackgroundAddress: string = networkMapping[CHAINID].YiqiBackground[networkMapping[CHAINID].YiqiBackground.length - 1]

    return (
        <div>
            <h1 className="py-4 px-4 font-bold text-2xl">Your Backgrounds</h1>
            <ListNFTs nftAddress={yiqiBackgroundAddress} isBackground={true}/>
        </div>
    )
}

export default Backgrounds