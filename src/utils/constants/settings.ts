export const LIGHT_THEME = 'cd_light_theme_active';
export const DARK_THEME = 'cd_page_dark_mode';

export enum WalletType {
  HDWallet = 'HDWallet',
  LegacyWallet = 'LegacyWallet',
}

/*
singer : Casper signer
ledger : Ledger device
default: custom adding, view mode
*/
export enum CONNECTION_TYPES {
  casperSigner = 'caspersigner',
  ledger = 'ledger',
  passPhase = 'passphase',
  viewMode = 'view_mode',
}

export const CONNECTED_ACCOUNT_STORAGE_PATH = 'connectedAccount';
