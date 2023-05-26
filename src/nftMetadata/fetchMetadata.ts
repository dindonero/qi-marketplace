export const requestNFTMetadataBackend = async (tokenIds: number[]) => {
    let metadatas = {}

    for (const tokenId of tokenIds)
        metadatas[tokenId] = fetch(`http://localhost:3000/api/token/${tokenId}`)
    for (const tokenId of tokenIds)
        metadatas[tokenId] = await (await metadatas[tokenId]).json()

    return metadatas
}

export const requestBackgroundMetadataBackend = async (tokenIds: number[]) => {
    let metadatas = []

    for (const tokenId of tokenIds)
        metadatas[tokenId] = fetch(`http://localhost:3000/api/background/${tokenId}`)
    for (const tokenId of tokenIds)
        metadatas[tokenId] = await (await metadatas[tokenId]).json()

    return metadatas
}