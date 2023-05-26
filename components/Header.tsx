import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <Link href="/"><h1 className="py-4 px-4 font-bold text-3xl">Home</h1></Link>
            <Link href="/mint"><div className="mr-4 p-6">Mint a Yiqi</div></Link>
            <Link href="/yiqis"><div className="mr-4 p-6">Your Yiqis</div></Link>
            <Link href="/backgrounds"><div className="mr-4 p-6">Backgrounds</div></Link>
            <div className="flex flex-row items-end">
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}