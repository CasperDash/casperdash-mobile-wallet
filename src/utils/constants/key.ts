import APP_CONFIGS from '../config/index';

export const PAYMENT_AMOUNT = 100000000000;
export const MOTE_RATE = 1000000000;
export const CSPR_TRANSFER_FEE = 0.1;
export const CSPR_AUCTION_DELEGATE_FEE = 2.5;
export const CSPR_AUCTION_UNDELEGATE_FEE = 0.00001;
export const TOKEN_TRANSFER_FEE = 1;
export const REFRESH_TIME = 1 * 60 * 1000;
export const MIN_CSPR_TRANSFER = 2.5;
export const MIN_CSPR_DELEGATE_TO_NEW_VALIDATOR = 500;
export const MAX_DELEGATOR_PER_VALIDATOR = 952;
export const KEY_PREFIX = ['account-hash-', 'uref-', 'hash-'];
export const BASE_API_URL = 'http://localhost:3001';
export const DEPLOY_TTL_MS = 1800000;
export const ENTRY_POINT_DELEGATE = 'delegate';
export const ENTRY_POINT_UNDELEGATE = 'undelegate';
export const CASPER_SYMBOL = 'CSPR';
export const NFT_GATEWAY = 'ipfs.dweb.link';
export const CASPER_KEY_PATH = "m/44'/506'/0'/0/";
export const CASPERDASH_URL = 'https://casperdash.io/';
export const NETWORK_URL = APP_CONFIGS.NETWORK_URL;
export const NETWORK_NAME = APP_CONFIGS.NETWORK_NAME;
export const EXPLORER_URL = APP_CONFIGS.EXPLORER_URL;
export const AUCTION_HASH = APP_CONFIGS.AUCTION_HASH;
export const DEFAULT_NUMBER_OF_RECOVERY_WORDS = 12;
export const NUMBER_OF_RECOVERY_WORDS = [12, 24];
export const NUMBER_WORDS_PER_ROW = 3;
export const PIN_LENGTH = 6;
export const SUPPORT_URL = 'https://t.me/CasperDash_Official';
export const DOCS_URL = 'https://docs.casperdash.io/';
export enum StakingMode {
  Undelegate = 'Undelegate',
  Delegate = 'Delegate',
}
export enum DeployStatus {
  pending = 'pending',
  failed = 'failed',
  completed = 'completed',
  undelegating = 'undelegating',
}

export const DERIVATION_PATH = [
  {
    value: `m/PURPOSE'/COINT_TYPE'/INDEX'`,
    label: `m/44'/506'/index (CasperDash)`,
  },
  {
    value: `m/PURPOSE'/COINT_TYPE'/0'/0/INDEX`,
    label: `m/44'/506'/0'/0/index (Casper Wallet)`,
  },
];
