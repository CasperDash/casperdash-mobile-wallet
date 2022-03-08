import { AUCTION_HASH } from 'utils/constants/key';

export const contractHashes = {
  auction: Uint8Array.from(Buffer.from(AUCTION_HASH, 'hex')),
};
