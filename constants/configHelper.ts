
export const CHAIN_ID= 5

export const DEFAULT_SLIPPAGE = 0.5
export const MIN_SLIPPAGE = 0.0001;
export const MAX_SLIPPAGE = 50;

export const CHANGE_BACKGROUND_MESSAGE = (ethereumAddress: string, tokenId: string, backgroundTokenId: string) => `Sign this message to authorize the following operation:
- Operation: Change Yiqi background
- Ethereum address: ${ethereumAddress}
- Token ID: ${tokenId}
- New background token ID: ${backgroundTokenId}
`;