import { AUCTION_HASH } from 'utils/constants/key';

export const contractHashes = {
  // eslint-disable-next-line no-undef
  auction: Uint8Array.from(Buffer.from(AUCTION_HASH, 'hex')),
};
