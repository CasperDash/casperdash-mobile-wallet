import { BigNumber } from '@ethersproject/bignumber';

export interface IBalance {
  hex?: string;
  type?: string;
}

export interface ITokenInfoResponse {
  address: string;
  balance: { hex?: string; type?: string; displayValue?: BigNumber };
  name: string;
  symbol: string;
  total_supply?: { hex?: string; type?: string; displayValue?: BigNumber };
  decimals?: { hex?: string; type?: string; displayValue?: BigNumber };
}

export interface INamedKey {
  name: string;
  key: string;
}

export interface IAssociatedKey {
  accountHash: string;
  weight: number;
}

export interface IActionThresholds {
  deployment: number;
  keyManagement: number;
}

export interface IDisplayCSPRBalance extends IBalance {
  displayBalance: BigNumber;
}

export interface IAccountResponse {
  _accountHash?: string;
  namedKeys?: INamedKey[];
  mainPurse?: string;
  associatedKeys?: IAssociatedKey[];
  actionThresholds?: IActionThresholds;
  balance?: IBalance;
  publicKey: string;
}
