export const requestNFTMetadataBackend = async (tokenIds: number[]) => {
    let metadatas: { [key: number]: Promise<Response> } = {};

    for (const tokenId of tokenIds)
        metadatas[tokenId] = fetch(`http://localhost:3000/api/token/${tokenId}`)

    return metadatas
}

export const requestBackgroundMetadataBackend = async (tokenIds: number[]) => {
    let metadatas: { [key: number]: Promise<Response> } = {};

    for (const tokenId of tokenIds)
        metadatas[tokenId] = fetch(`http://localhost:3000/api/background/${tokenId}`)

    return metadatas
}