import {NextPage} from "next";
import networkMapping from "../constants/networkMapping.json";
import {CHAINID} from "../constants/chainId";
import ListNFTs from "../components/ListNFTs";

const Yiqis: NextPage = () => {

    return (
        <div>
            <h1 className="py-4 px-4 font-bold text-2xl">Your Yiqis</h1>
            <ListNFTs nftAddress={networkMapping[CHAINID].Yiqi[networkMapping[CHAINID].Yiqi.length - 1]}
                      isBackground={false}/>
        </div>
    )
}

export default Yiqis