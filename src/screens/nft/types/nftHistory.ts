import { DeployStatus } from 'utils/constants/key';

export type NFTHistory = {
  name?: string;
  status: DeployStatus;
  image?: string;
  deployHash: string;
  contractAddress: string;
  contractHash: string;
  tokenId: string;
  fromPublicKeyHex: string;
  toPublicKeyHex: string;
  tokenStandardId: number;
  paymentAmount?: string;
  networkFee?: number;
  timestamp?: string;
};
