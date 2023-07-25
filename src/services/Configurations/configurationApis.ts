import { request } from 'services/request';

import {
  MOTE_RATE,
  CSPR_TRANSFER_FEE,
  CSPR_AUCTION_DELEGATE_FEE,
  CSPR_AUCTION_UNDELEGATE_FEE,
  TOKEN_TRANSFER_FEE,
  MIN_CSPR_DELEGATE_TO_NEW_VALIDATOR,
  MAX_DELEGATOR_PER_VALIDATOR,
  AUCTION_HASH,
  MIN_CSPR_TRANSFER,
  SUPPORT_URL,
  DOCS_URL,
} from 'utils/constants/key';

export interface IConfigurationResponse {
  MOTE_RATE: number;
  API_VERSION: string;
  CSPR_TRANSFER_FEE: number;
  CSPR_AUCTION_DELEGATE_FEE: number;
  CSPR_AUCTION_UNDELEGATE_FEE: number;
  TOKEN_TRANSFER_FEE: number;
  MIN_CSPR_DELEGATE_TO_NEW_VALIDATOR: number;
  MAX_DELEGATOR_PER_VALIDATOR: number;
  STAKE_AUCTION_HASH: string;
  MIN_CSPR_TRANSFER: number;
  ANDROID_APP_VERSION?: string;
  IOS_APP_VERSION?: string;
  SUPPORT_URL?: string;
  DOCS_URL?: string;
  PRIVACY_URL?: string;
  UNDELEGATE_TIME_NOTICE?: string;
}

export const getConfigurations = async (): Promise<IConfigurationResponse> => {
  const response = await request.get<IConfigurationResponse>('/configurations');

  return (
    response.data || {
      MOTE_RATE,
      CSPR_TRANSFER_FEE,
      CSPR_AUCTION_DELEGATE_FEE,
      CSPR_AUCTION_UNDELEGATE_FEE,
      TOKEN_TRANSFER_FEE,
      MIN_CSPR_DELEGATE_TO_NEW_VALIDATOR,
      MAX_DELEGATOR_PER_VALIDATOR,
      STAKE_AUCTION_HASH: AUCTION_HASH,
      MIN_CSPR_TRANSFER,
      API_VERSION: '1.5.3',
      SUPPORT_URL,
      DOCS_URL,
    }
  );
};
