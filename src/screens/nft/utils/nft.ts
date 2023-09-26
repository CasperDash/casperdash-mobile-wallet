import { CLKeyParameters, CLPublicKey, CLValueBuilder, DeployUtil, RuntimeArgs } from 'casperdash-js-sdk';
import { NETWORK_NAME } from 'utils/constants/key';
import { callEntrypoint, callSessionWasm } from 'utils/services/casperServices';
import TransferCallWasm from '../wasm/transfer_call.wasm';
import { TokenStandards } from './token';
import { BigNumberish } from '@ethersproject/bignumber';

export interface TransferNFTParams {
  contractHash: string;
  tokenId: string | number;
  toPublicKeyHex: string;
  fromPublicKeyHex: string;
  tokenStandardId: TokenStandards;
  paymentAmount: BigNumberish;
  image?: string;
  name?: string;
  isUsingSessionCode?: boolean;
  wasmName?: string;
}

export interface TokenArgs {
  tokenId?: string;
  tokenHash?: string;
}

export type TransferArgs = {
  target: CLKeyParameters;
  source: CLKeyParameters;
  contractHash: string;
} & TokenArgs;

export interface CallConfig {
  useSessionCode: boolean;
}

enum ERRORS {
  CONFLICT_CONFIG = 'Conflicting arguments provided',
}

export const MAP_WASM: Record<string, Uint8Array> = {
  transfer_call: TransferCallWasm,
};

const convertHashStrToHashBuff = (hashStr: string) => {
  let hashHex = hashStr;
  if (hashStr.startsWith('hash-')) {
    hashHex = hashStr.slice(5);
  }
  return Buffer.from(hashHex, 'hex');
};

export const transferNFT = async ({
  tokenStandardId,
  contractHash,
  fromPublicKeyHex,
  toPublicKeyHex,
  tokenId,
  paymentAmount,
  isUsingSessionCode,
  wasmName,
}: TransferNFTParams): Promise<DeployUtil.Deploy> => {
  const clFromPublicKey = CLPublicKey.fromHex(fromPublicKeyHex);
  const clToPublicKey = CLPublicKey.fromHex(toPublicKeyHex);

  switch (tokenStandardId) {
    case TokenStandards.CEP78:
      let wasm: Uint8Array | undefined;
      if (!wasmName || !MAP_WASM[wasmName]) {
        throw new Error('Invalid wasm name');
      }
      wasm = MAP_WASM[wasmName];

      return transferCEP78(
        {
          tokenId: tokenId.toString(),
          source: clFromPublicKey,
          target: clToPublicKey,
          contractHash: `hash-${contractHash}`,
        },
        {
          useSessionCode: !!isUsingSessionCode,
        },
        paymentAmount.toString(),
        clFromPublicKey,
        wasm,
      );

    case TokenStandards.CEP47:
      return transferCEP47(
        clToPublicKey,
        clFromPublicKey,
        [tokenId.toString()],
        `hash-${contractHash}`,
        paymentAmount.toString(),
        clFromPublicKey,
      );
    default:
      throw new Error('Invalid contract type');
  }
};

export const transferCEP78 = (
  args: TransferArgs,
  config: CallConfig,
  paymentAmount: string,
  deploySender: CLPublicKey,
  wasm?: Uint8Array,
) => {
  const { contractHash } = args;
  const contractHashKey = CLValueBuilder.key(CLValueBuilder.byteArray(convertHashStrToHashBuff(contractHash)));

  if (config.useSessionCode === false && !!wasm) throw new Error(ERRORS.CONFLICT_CONFIG);

  const runtimeArgs = RuntimeArgs.fromMap({
    target_key: CLValueBuilder.key(args.target),
    source_key: CLValueBuilder.key(args.source),
  });

  if (args.tokenId) {
    runtimeArgs.insert('is_hash_identifier_mode', CLValueBuilder.bool(false));
    runtimeArgs.insert('token_id', CLValueBuilder.u64(args.tokenId));
  }

  if (args.tokenHash) {
    runtimeArgs.insert('is_hash_identifier_mode', CLValueBuilder.bool(true));
    runtimeArgs.insert('token_id', CLValueBuilder.u64(args.tokenHash));
  }

  if (config.useSessionCode) {
    if (!wasm) {
      throw new Error('Missing wasm argument');
    }
    if (!contractHashKey) {
      throw new Error('Missing contractHashKey argument');
    }
    runtimeArgs.insert('nft_contract_hash', contractHashKey);
    const wasmToCall = wasm;

    const preparedDeploy = callSessionWasm(wasmToCall, runtimeArgs, paymentAmount, deploySender, NETWORK_NAME);

    return preparedDeploy;
  }

  const preparedDeploy = callEntrypoint(
    'transfer',
    runtimeArgs,
    deploySender,
    NETWORK_NAME,
    paymentAmount,
    contractHash,
  );

  return preparedDeploy;
};

export const transferCEP47 = (
  recipient: CLKeyParameters,
  owner: CLKeyParameters,
  ids: string[],
  contractHash: string,
  paymentAmount: string,
  deploySender: CLPublicKey,
) => {
  const runtimeArgs = RuntimeArgs.fromMap({
    recipient: CLValueBuilder.key(recipient),
    sender: CLValueBuilder.key(owner),
    token_ids: CLValueBuilder.list(ids.map((id) => CLValueBuilder.u256(id))),
  });

  return callEntrypoint('transfer_from', runtimeArgs, deploySender, NETWORK_NAME, paymentAmount, contractHash);
};
