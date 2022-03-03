import APP_CONFIGS from '../config';

export const PAYMENT_AMOUNT = 100000000000;
export const MOTE_RATE = 1000000000;
export const CSPR_TRANSFER_FEE = 0.1;
export const CSPR_AUCTION_DELEGATE_FEE = 2.5;
export const CSPR_AUCTION_UNDELEGATE_FEE = 0.00001;
export const TOKEN_TRANSFER_FEE = 1;
export const REFRESH_TIME = 1 * 60 * 1000;
export const MIN_CSPR_TRANSFER = 2.5;
export const KEY_PREFIX = ['account-hash-', 'uref-', 'hash-'];
export const NETWORK_NAME = APP_CONFIGS.NETWORK_NAME || 'casper-test';
export const BASE_API_URL = 'http://localhost:3001';
export const DEPLOY_TTL_MS = 1800000;
export const ENTRY_POINT_DELEGATE = 'delegate';
export const ENTRY_POINT_UNDELEGATE = 'undelegate';
export const EXPLORER_URL = __DEV__ ? 'https://testnet.cspr.live' : 'https://cspr.live';
export const CASPER_SYMBOL = 'CSPR';
export const NFT_GATEWAY = 'ipfs.dweb.link';
export const CASPER_KEY_PATH = 'm/44\'/506\'/0\'/0/';
export const CASPERDASH_URL = 'https://casperdash.io/';
export const NETWORK_URL = __DEV__ ? 'https://testnet-api.casperdash.io' : 'https://api.casperdash.io';
