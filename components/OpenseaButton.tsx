import React from 'react';
import Link from "next/link";
import {CHAIN_ID} from "../constants/configHelper";
import networkMapping from "../constants/networkMapping.json";

interface OpenseaButtonProps {
    tokenId: string
    isBackground: boolean
}
export const OpenseaButton = (props: OpenseaButtonProps) => {

    const OPENSEA_URL = CHAIN_ID === 5 ? "https://testnets.opensea.io/assets/goerli/" : "https://opensea.io/assets/ethereum/"

    const yiqiAddress: string  = networkMapping[CHAIN_ID].Yiqi[networkMapping[CHAIN_ID].Yiqi.length - 1]

    const yiqiBackgroundAddress: string = networkMapping[CHAIN_ID].YiqiBackground[networkMapping[CHAIN_ID].YiqiBackground.length - 1]


    const link = props.isBackground ? OPENSEA_URL + yiqiBackgroundAddress + "/" + props.tokenId : OPENSEA_URL + yiqiAddress + "/" + props.tokenId

    return (
        <div className="container mx-auto p-4">
            <Link href={link} target="_blank" className={"text-yellow-950 text-xl font-bold text"}>
                Opensea
            </Link>
        </div>
    )
};

export default OpenseaButton;