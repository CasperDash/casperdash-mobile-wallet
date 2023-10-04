import { request } from 'services/request';
import { TBalance } from 'utils/types/types';

export interface IMetadata {
  key: string;
  value: string;
  name?: string;
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
  tokenStandardId: number;
  isTransfarable?: boolean;
  isUsingSessionCode?: boolean;
  wasmName?: string;
}

export const getNFTs = async (publicKey: string): Promise<INFTInfo[]> => {
  const response = await request.get<INFTInfo[]>(`/nfts/${publicKey}`);

  return response.data;
};
