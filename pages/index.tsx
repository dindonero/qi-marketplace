import {NextPage} from "next";
import {useMoralis} from "react-moralis";

const Home: NextPage = () => {

    const {isWeb3Enabled} = useMoralis()

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Yiqi NFTs Marketplace</h1>
        </div>
    );
}

export default Home