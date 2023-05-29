import {NextPage} from "next";
import networkMapping from "../constants/networkMapping.json";
import {CHAINID} from "../constants/chainId";
import ListNFTs from "../components/ListNFTs";

const Yiqis: NextPage = () => {

    const yiqiAddress: string  = networkMapping[CHAINID].Yiqi[networkMapping[CHAINID].Yiqi.length - 1]

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Your Yiqis</h1>
            <ListNFTs nftAddress={yiqiAddress}
                      isBackground={false}/>
        </div>
    )
}

export default Yiqis