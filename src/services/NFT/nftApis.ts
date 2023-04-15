import { NETWORK_URL } from 'utils/constants/key';
import { TBalance } from 'utils/types/types';

export interface IMetadata {
  key: string;
  value: string;
}

export interface INFTInfo {
  tokenId: string;
  contractName: string;
  contractAddress: string;
  metadata: IMetadata[];
  ownerAccountHash: string;
  symbol: string;
  name: string;
  totalSupply: TBalance;
  image?: string;
  nftName?: string;
  background?: string;
}

export const getNFTs = async (publicKey: string): Promise<INFTInfo[]> => {
  const response = await fetch(`${NETWORK_URL}/nfts/${publicKey}`);

  if (!response.ok) {
    throw new Error('Cant get nfts info');
  }

  return (await response.json()) || {};
};
