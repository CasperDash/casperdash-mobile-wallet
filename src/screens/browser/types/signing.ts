import { JsonTypes } from 'typedjson';

export type SignDeployParams = {
  deploy?: {
    deploy: JsonTypes;
  };
  signingPublicKeyHex: string;
  targetPublicKeyHex: string;
};

export type SignMessageParams = {
  message: string;
  signingPublicKeyHex: string;
};
