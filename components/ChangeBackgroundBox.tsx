import Image from "next/image"
import {Card} from "web3uikit"
import {useEffect, useState} from "react";
import { useRouter } from "next/router";

interface ChangeBackgroundBoxProps {
    tokenId: string;
    tokenJsonMetadata: any;
    selectedBackgroundTokenId: string | undefined;
    onSelectBackground: (tokenId: string | undefined) => void;
}
export default function ChangeBackgroundBox(props: ChangeBackgroundBoxProps) {

    return (
        (
            <div className="container mx-auto">
                <div className="flex flex-wrap">
            <div className="p-4">
                <Card
                    title={`Yiqi #${props.tokenId}`}
                    onClick={() => props.selectedBackgroundTokenId === props.tokenId ? props.onSelectBackground(undefined) : props.onSelectBackground(props.tokenId)}
                    isSelected={props.selectedBackgroundTokenId === props.tokenId}
                >
                    <div className="p-2">
                        <div className="flex flex-col items-end gap-2">
                            <div>#{props.tokenId}</div>
                            <Image
                                alt={`Yiqi #${props.tokenId}`}
                                loader={() => props.tokenJsonMetadata.image}
                                src={props.tokenJsonMetadata.image}
                                height="250"
                                width="250"
                            />
                        </div>
                    </div>
                </Card>
                <div className={"p-2"}/>
            </div>
            </div>
            </div>
        )
    )
}