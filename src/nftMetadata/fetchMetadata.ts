export const requestNFTMetadataBackend = async (tokenIds: number[]) => {
    let metadatas: { [key: number]: Promise<Response> } = {};

    for (const tokenId of tokenIds)
        metadatas[tokenId] = fetch(`/api/token/${tokenId}`)

    return metadatas
}

export const requestBackgroundMetadataBackend = async (tokenIds: number[]): Promise<{[p: number]: Promise<Response>}> => {
    let metadatas: { [key: number]: Promise<Response> } = {};

    for (const tokenId of tokenIds)
        metadatas[tokenId] = requestBackgroundMetadata(tokenId)

    return metadatas
}

export const requestBackgroundMetadata = async (tokenId: number) => {

    return fetch(`/api/background/${tokenId}`)
}

export const requestTransparentURL = async (tokenId: number) => {

    return fetch(`/api/transparent/${tokenId}`)
}