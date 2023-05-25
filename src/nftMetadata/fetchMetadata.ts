
export const requestNFTMetadataBackend = async (tokenId: number) => {
    const response = await fetch(`http://localhost:3000/api/token/${tokenId}`)
    return response.json()
}