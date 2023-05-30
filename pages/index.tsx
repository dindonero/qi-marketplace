import {NextPage} from "next";
import {useMoralis} from "react-moralis";
import Image from "next/image";

const Home: NextPage = () => {
    const backgroundImage = "/images/home9.jpg"; // Path to your image file

    return (
        <div style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
            <h1 className="font-bold text-5xl">Yiqi NFTs Marketplace</h1>
            {/* <Image src="/images/home.jpg" alt="Description of the image" width={100%} height={100vh}/> */}
        </div>
    );
}

export default Home