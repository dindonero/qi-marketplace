import ChangeBackgroundButton from "../components/ChangeBackgroundButton";

const ChangeBackground = () => {
    const backgroundImage = "/images/home10.jpg";

    return (
        <div style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "left",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
        }}
        >
            <h1 className="font-bold text-5xl">Change background on your Yiqis</h1>
            <ChangeBackgroundButton tokenId={"0"} backgroundTokenId={"0"} /> {/* todo tokenId */}

        </div>
    );
}

export default ChangeBackground