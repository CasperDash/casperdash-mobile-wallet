import _ from 'lodash';
import { SignDeployParams, SignMessageParams } from '../types/signing';
import { JsonTypes } from 'typedjson';

export const normalizeSignDeployParams = (params?: Record<string, string | undefined>): SignDeployParams => {
  return {
    targetPublicKeyHex: _.get(params, 'targetPublicKeyHex', ''),
    signingPublicKeyHex: _.get(params, 'signingPublicKeyHex', ''),
    deploy: <
      {
        deploy: JsonTypes;
      }
    >(<unknown>_.get(params, 'deploy')),
  };
};

export const normalizeSignMessageParams = (params?: Record<string, string | undefined>): SignMessageParams => {
  return {
    signingPublicKeyHex: _.get(params, 'signingPublicKeyHex', ''),
    message: _.get(params, 'message', ''),
  };
};
