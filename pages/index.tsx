import {NextPage} from "next";
import {useMoralis} from "react-moralis";

const Home: NextPage = () => {

    const {isWeb3Enabled} = useMoralis()

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    <div>Loading...</div>
                ) : (
                    <div>Web3 Currently Not Enabled </div>
                )}
            </div>
        </div>
    );
}

export default Home